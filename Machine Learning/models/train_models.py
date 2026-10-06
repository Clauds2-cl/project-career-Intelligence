from pathlib import Path
import warnings

import joblib
import numpy as np
import pandas as pd

from sklearn.compose import ColumnTransformer
from sklearn.ensemble import ExtraTreesClassifier, RandomForestClassifier
from sklearn.impute import SimpleImputer
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
    f1_score,
)
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder

warnings.filterwarnings("ignore")

BASE_DIR = Path(__file__).resolve().parent

DATA_FILE = BASE_DIR / "Claudia's Datasets Updated Academic Model.xlsx"

MODEL_DIR = BASE_DIR / "trained_models"
OUTPUT_DIR = BASE_DIR / "outputs"

MODEL_DIR.mkdir(parents=True, exist_ok=True)
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

RANDOM_STATE = 42

GRADE_MAP = {
    "A": 12,
    "A-": 11,
    "B+": 10,
    "B": 9,
    "B-": 8,
    "C+": 7,
    "C": 6,
    "C-": 5,
    "D+": 4,
    "D": 3,
    "D-": 2,
    "E": 1,
}


DATASET_CONFIG = {
    "Dataset1_Course_Recommendation": {
        "target": "Recommended_Course",
        "model": "course",
        "drop_columns": [
            "Student_ID",
        ],
    },
    "Dataset2_Career_Prediction": {
        "target": "Recommended_Career",
        "model": "career",
        "drop_columns": [
            "Student_ID",
        ],
    },
    "Dataset3_Skill_Gap_Analysis": {
        "target": "Skill_Gap_Level",
        "model": "skill_gap",
        "drop_columns": [
            "Student_ID",
        ],
    },
    "Dataset4_Career_Readiness": {
        "target": "Readiness_Status",
        "model": "readiness",
        "drop_columns": [
            "Student_ID",
            "Career_Readiness_Score",
        ],
    },
}


def print_header(title):
    print()
    print("=" * 70)
    print(title)
    print("=" * 70)


def clean_columns(df):
    df = df.copy()

    df.columns = [
        str(column).strip()
        for column in df.columns
    ]

    df = df.replace(
        r"^\s*$",
        np.nan,
        regex=True,
    )

    return df


def normalize_grade_values(df):
    df = df.copy()

    grade_columns = [
        column
        for column in df.columns
        if "GRADE" in column.upper()
    ]

    for column in grade_columns:

        if df[column].dtype == "object":

            values = (
                df[column]
                .astype(str)
                .str.strip()
                .str.upper()
                .replace(
                    {
                        "NAN": np.nan,
                        "NONE": np.nan,
                        "": np.nan,
                    }
                )
            )

            mapped = values.map(
                GRADE_MAP
            )

            numeric_values = pd.to_numeric(
                values,
                errors="coerce",
            )

            df[column] = mapped.fillna(
                numeric_values
            )

    return df


def add_skill_gap_features(df):
    """
    Build additional features from the relationships among:
    Desired_Career,
    Current_Skill,
    Missing_Skill,
    Recommended_Certification.
    """

    df = df.copy()

    text_columns = [
        "Desired_Career",
        "Current_Skill",
        "Missing_Skill",
        "Recommended_Certification",
    ]

    for column in text_columns:

        if column not in df.columns:
            df[column] = ""

        df[column] = (
            df[column]
            .fillna("")
            .astype(str)
            .str.strip()
        )

    df["Career_Length"] = (
        df["Desired_Career"]
        .str.len()
    )

    df["Current_Skill_Length"] = (
        df["Current_Skill"]
        .str.len()
    )

    df["Missing_Skill_Length"] = (
        df["Missing_Skill"]
        .str.len()
    )

    df["Certification_Length"] = (
        df["Recommended_Certification"]
        .str.len()
    )

    df["Career_Word_Count"] = (
        df["Desired_Career"]
        .str.split()
        .str.len()
    )

    df["Current_Skill_Word_Count"] = (
        df["Current_Skill"]
        .str.split()
        .str.len()
    )

    df["Missing_Skill_Word_Count"] = (
        df["Missing_Skill"]
        .str.split()
        .str.len()
    )

    df["Certification_Word_Count"] = (
        df["Recommended_Certification"]
        .str.split()
        .str.len()
    )

    df["Skill_Length_Difference"] = (
        df["Missing_Skill_Length"]
        - df["Current_Skill_Length"]
    )

    df["Total_Skill_Text_Length"] = (
        df["Current_Skill_Length"]
        + df["Missing_Skill_Length"]
        + df["Certification_Length"]
    )

    df["Career_CurrentSkill"] = (
        df["Desired_Career"]
        + " | "
        + df["Current_Skill"]
    )

    df["Career_MissingSkill"] = (
        df["Desired_Career"]
        + " | "
        + df["Missing_Skill"]
    )

    df["Current_MissingSkill"] = (
        df["Current_Skill"]
        + " | "
        + df["Missing_Skill"]
    )

    df["Career_Certification"] = (
        df["Desired_Career"]
        + " | "
        + df["Recommended_Certification"]
    )

    df["Missing_Certification"] = (
        df["Missing_Skill"]
        + " | "
        + df["Recommended_Certification"]
    )

    df["CurrentSkill_Certification"] = (
        df["Current_Skill"]
        + " | "
        + df["Recommended_Certification"]
    )

    df["Complete_Skill_Profile"] = (
        df["Desired_Career"]
        + " | "
        + df["Current_Skill"]
        + " | "
        + df["Missing_Skill"]
        + " | "
        + df["Recommended_Certification"]
    )

    return df


def remove_empty_columns(df, target):
    df = df.copy()

    empty_columns = [
        column
        for column in df.columns
        if column != target
        and df[column].notna().sum() == 0
    ]

    if empty_columns:
        df = df.drop(
            columns=empty_columns
        )

    return df


def remove_constant_columns(df, target):
    df = df.copy()

    constant_columns = [
        column
        for column in df.columns
        if column != target
        and df[column].nunique(
            dropna=True
        ) <= 1
    ]

    if constant_columns:
        df = df.drop(
            columns=constant_columns
        )

    return df


def prepare_dataset(
    df,
    dataset_name,
    config,
):
    target = config["target"]

    df = clean_columns(df)

    if target not in df.columns:
        raise ValueError(
            f"Target column '{target}' was not found."
        )

    df = df.dropna(
        subset=[target]
    )

    for column in config["drop_columns"]:

        if column in df.columns:
            df = df.drop(
                columns=[column]
            )

    if dataset_name == "Dataset3_Skill_Gap_Analysis":
        df = add_skill_gap_features(
            df
        )

    df = normalize_grade_values(
        df
    )

    df = remove_empty_columns(
        df,
        target,
    )

    df = remove_constant_columns(
        df,
        target,
    )

    return df


def remove_rare_classes(
    X,
    y,
    minimum_records=2,
):
    counts = y.value_counts()

    valid_classes = counts[
        counts >= minimum_records
    ].index

    removed_classes = counts[
        counts < minimum_records
    ]

    if len(removed_classes) > 0:

        print(
            f"[TRAIN] Removing "
            f"{len(removed_classes)} target classes "
            f"with fewer than "
            f"{minimum_records} records."
        )

    mask = y.isin(
        valid_classes
    )

    X = X.loc[mask].reset_index(
        drop=True
    )

    y = y.loc[mask].reset_index(
        drop=True
    )

    return X, y


def create_preprocessor(X):
    categorical_features = (
        X.select_dtypes(
            include=[
                "object",
                "category",
                "bool",
            ]
        )
        .columns
        .tolist()
    )

    numeric_features = [
        column
        for column in X.columns
        if column
        not in categorical_features
    ]

    transformers = []

    if categorical_features:

        categorical_pipeline = Pipeline(
            steps=[
                (
                    "imputer",
                    SimpleImputer(
                        strategy="most_frequent"
                    ),
                ),
                (
                    "encoder",
                    OneHotEncoder(
                        handle_unknown="ignore"
                    ),
                ),
            ]
        )

        transformers.append(
            (
                "categorical",
                categorical_pipeline,
                categorical_features,
            )
        )

    if numeric_features:

        numeric_pipeline = Pipeline(
            steps=[
                (
                    "imputer",
                    SimpleImputer(
                        strategy="median"
                    ),
                ),
            ]
        )

        transformers.append(
            (
                "numeric",
                numeric_pipeline,
                numeric_features,
            )
        )

    return ColumnTransformer(
        transformers=transformers,
        remainder="drop",
    )


def create_model(model_type):

    if model_type == "course":

        return RandomForestClassifier(
            n_estimators=1000,
            max_features=1.0,
            min_samples_leaf=2,
            class_weight="balanced_subsample",
            n_jobs=-1,
            random_state=RANDOM_STATE,
        )

    if model_type == "career":

        return RandomForestClassifier(
            n_estimators=700,
            max_features="sqrt",
            min_samples_leaf=1,
            class_weight="balanced_subsample",
            n_jobs=-1,
            random_state=RANDOM_STATE,
        )

    if model_type == "skill_gap":

        return ExtraTreesClassifier(
            n_estimators=1200,
            max_features=1.0,
            min_samples_leaf=1,
            class_weight="balanced",
            n_jobs=-1,
            random_state=RANDOM_STATE,
        )

    if model_type == "readiness":

        return RandomForestClassifier(
            n_estimators=700,
            max_features="sqrt",
            min_samples_leaf=1,
            class_weight="balanced_subsample",
            n_jobs=-1,
            random_state=RANDOM_STATE,
        )

    raise ValueError(
        f"Unknown model type: {model_type}"
    )


def calculate_majority_baseline(
    y_test
):
    counts = y_test.value_counts()

    if len(counts) == 0:
        return 0.0

    return float(
        counts.iloc[0]
        / len(y_test)
    )


def get_feature_importance(
    pipeline
):
    try:

        preprocessor = (
            pipeline
            .named_steps[
                "preprocessor"
            ]
        )

        classifier = (
            pipeline
            .named_steps[
                "classifier"
            ]
        )

        feature_names = (
            preprocessor
            .get_feature_names_out()
        )

        importances = (
            classifier
            .feature_importances_
        )

        importance_df = pd.DataFrame(
            {
                "Feature": feature_names,
                "Importance": importances,
            }
        )

        return importance_df.sort_values(
            "Importance",
            ascending=False,
        )

    except Exception:

        return pd.DataFrame(
            columns=[
                "Feature",
                "Importance",
            ]
        )


def train_dataset(
    dataset_name,
    raw_df,
    config,
):

    print_header(
        f"[TRAIN] Training {dataset_name}"
    )

    print(
        f"[TRAIN] Loaded "
        f"{len(raw_df)} records."
    )

    df = prepare_dataset(
        raw_df,
        dataset_name,
        config,
    )

    target = config["target"]

    X = df.drop(
        columns=[target]
    )

    y = (
        df[target]
        .astype(str)
        .str.strip()
    )

    X, y = remove_rare_classes(
        X,
        y,
    )

    class_count = y.nunique()

    print(
        f"[TRAIN] Training records: "
        f"{len(y)}"
    )

    print(
        f"[TRAIN] Target classes: "
        f"{class_count}"
    )

    print(
        f"[TRAIN] Features used: "
        f"{X.shape[1]}"
    )

    if class_count < 2:
        raise ValueError(
            f"{dataset_name} has fewer "
            f"than 2 target classes."
        )

    class_counts = y.value_counts()

    if class_counts.min() < 2:
        raise ValueError(
            f"{dataset_name} contains "
            f"a class with fewer than "
            f"2 records."
        )

    X_train, X_test, y_train, y_test = (
        train_test_split(
            X,
            y,
            test_size=0.20,
            random_state=RANDOM_STATE,
            stratify=y,
        )
    )

    preprocessor = create_preprocessor(
        X
    )

    classifier = create_model(
        config["model"]
    )

    pipeline = Pipeline(
        steps=[
            (
                "preprocessor",
                preprocessor,
            ),
            (
                "classifier",
                classifier,
            ),
        ]
    )

    print(
        "[TRAIN] Fitting model..."
    )

    pipeline.fit(
        X_train,
        y_train,
    )

    predictions = pipeline.predict(
        X_test
    )

    accuracy = accuracy_score(
        y_test,
        predictions,
    )

    macro_f1 = f1_score(
        y_test,
        predictions,
        average="macro",
        zero_division=0,
    )

    weighted_f1 = f1_score(
        y_test,
        predictions,
        average="weighted",
        zero_division=0,
    )

    majority_baseline = (
        calculate_majority_baseline(
            y_test
        )
    )

    print(
        f"[TRAIN] Accuracy: "
        f"{accuracy:.4f}"
    )

    print(
        f"[TRAIN] Macro F1: "
        f"{macro_f1:.4f}"
    )

    print(
        f"[TRAIN] Weighted F1: "
        f"{weighted_f1:.4f}"
    )

    print(
        f"[TRAIN] Majority baseline: "
        f"{majority_baseline:.4f}"
    )

    report = classification_report(
        y_test,
        predictions,
        output_dict=True,
        zero_division=0,
    )

    report_df = (
        pd.DataFrame(report)
        .transpose()
    )

    report_df.to_excel(
        OUTPUT_DIR
        / f"{dataset_name}_classification_report.xlsx"
    )

    labels = sorted(
        list(
            set(y_test)
            | set(predictions)
        )
    )

    matrix = confusion_matrix(
        y_test,
        predictions,
        labels=labels,
    )

    confusion_df = pd.DataFrame(
        matrix,
        index=labels,
        columns=labels,
    )

    confusion_df.to_excel(
        OUTPUT_DIR
        / f"{dataset_name}_confusion_matrix.xlsx"
    )

    importance_df = (
        get_feature_importance(
            pipeline
        )
    )

    importance_df.to_excel(
        OUTPUT_DIR
        / f"{dataset_name}_feature_importance.xlsx",
        index=False,
    )

    model_path = (
        MODEL_DIR
        / f"{dataset_name}_model.joblib"
    )

    joblib.dump(
        pipeline,
        model_path,
    )

    print(
        f"[TRAIN] Model saved: "
        f"{model_path}"
    )

    return {
        "Dataset": dataset_name,
        "Target": target,
        "Records": len(y),
        "Features": X.shape[1],
        "Classes": class_count,
        "Accuracy": round(
            accuracy,
            4,
        ),
        "Macro_F1": round(
            macro_f1,
            4,
        ),
        "Weighted_F1": round(
            weighted_f1,
            4,
        ),
        "Majority_Baseline": round(
            majority_baseline,
            4,
        ),
        "Status": "TRAINED",
    }


def generate_data_quality_report(
    workbook
):

    rows = []

    academic_keywords = [
        "KCSE",
        "CBC",
        "Academic",
        "Education",
        "Pathway",
        "Subject",
        "Learning",
        "Performance",
    ]

    for dataset_name, config in (
        DATASET_CONFIG.items()
    ):

        df = pd.read_excel(
            workbook,
            sheet_name=dataset_name,
        )

        target = config["target"]

        academic_fields = [
            column
            for column in df.columns
            if any(
                keyword.lower()
                in column.lower()
                for keyword in academic_keywords
            )
        ]

        academic_fields_with_data = [
            column
            for column in academic_fields
            if df[column]
            .notna()
            .sum()
            > 0
        ]

        rows.append(
            {
                "Dataset": dataset_name,
                "Rows": len(df),
                "Columns": len(df.columns),
                "Target": target,
                "Target_NonNull": (
                    df[target]
                    .notna()
                    .sum()
                    if target in df.columns
                    else 0
                ),
                "Target_Classes": (
                    df[target]
                    .nunique()
                    if target in df.columns
                    else 0
                ),
                "Academic_Fields": len(
                    academic_fields
                ),
                "Academic_Fields_With_Data": len(
                    academic_fields_with_data
                ),
            }
        )

    report = pd.DataFrame(
        rows
    )

    print_header(
        "DATA QUALITY REPORT"
    )

    print(
        report.to_string(
            index=False
        )
    )

    report.to_excel(
        OUTPUT_DIR
        / "data_quality_report.xlsx",
        index=False,
    )

    return report


def main():

    print(
        "[TRAIN] Using dataset:"
    )

    print(
        DATA_FILE
    )

    if not DATA_FILE.exists():

        raise FileNotFoundError(
            f"\nWorkbook not found:\n"
            f"{DATA_FILE}\n\n"
            "Make sure the workbook is "
            "inside the same folder as "
            "train_models.py."
        )

    workbook = pd.ExcelFile(
        DATA_FILE
    )

    required_sheets = list(
        DATASET_CONFIG.keys()
    )

    missing_sheets = [
        sheet
        for sheet in required_sheets
        if sheet
        not in workbook.sheet_names
    ]

    if missing_sheets:

        raise ValueError(
            "Missing required worksheet(s): "
            + ", ".join(
                missing_sheets
            )
        )

    generate_data_quality_report(
        workbook
    )

    results = []

    for dataset_name, config in (
        DATASET_CONFIG.items()
    ):

        try:

            df = pd.read_excel(
                DATA_FILE,
                sheet_name=dataset_name,
            )

            result = train_dataset(
                dataset_name,
                df,
                config,
            )

            results.append(
                result
            )

        except Exception as error:

            print()
            print(
                f"[ERROR] "
                f"{dataset_name} failed:"
            )

            print(
                str(error)
            )

            results.append(
                {
                    "Dataset": dataset_name,
                    "Target": config["target"],
                    "Records": 0,
                    "Features": 0,
                    "Classes": 0,
                    "Accuracy": 0,
                    "Macro_F1": 0,
                    "Weighted_F1": 0,
                    "Majority_Baseline": 0,
                    "Status": (
                        f"FAILED: {error}"
                    ),
                }
            )

    summary = pd.DataFrame(
        results
    )

    print_header(
        "FINAL TRAINING SUMMARY"
    )

    print(
        summary.to_string(
            index=False
        )
    )

    summary_path = (
        OUTPUT_DIR
        / "training_summary.xlsx"
    )

    summary.to_excel(
        summary_path,
        index=False,
    )

    print()
    print(
        f"[TRAIN] Summary saved: "
        f"{summary_path}"
    )

    print()
    print(
        "Training process complete."
    )

    dataset3 = summary[
        summary["Dataset"]
        == "Dataset3_Skill_Gap_Analysis"
    ]

    if not dataset3.empty:

        accuracy = float(
            dataset3.iloc[0][
                "Accuracy"
            ]
        )

        baseline = float(
            dataset3.iloc[0][
                "Majority_Baseline"
            ]
        )

        print()

        if accuracy > baseline:

            print(
                "[DATASET 3] Model is "
                "above the majority baseline."
            )

        else:

            print(
                "[WARNING] Dataset 3 accuracy "
                "is still below the majority baseline."
            )

            print(
                "[WARNING] Dataset 3 should "
                "not yet be used for production "
                "predictions."
            )

    dataset1 = summary[
        summary["Dataset"]
        == "Dataset1_Course_Recommendation"
    ]

    if not dataset1.empty:

        accuracy = float(
            dataset1.iloc[0][
                "Accuracy"
            ]
        )

        print()

        print(
            f"[DATASET 1] Final accuracy: "
            f"{accuracy:.4f} "
            f"({accuracy * 100:.2f}%)"
        )

        if accuracy >= 0.70:

            print(
                "[DATASET 1] Target of "
                "approximately 70% achieved."
            )

        else:

            print(
                "[DATASET 1] 70% target "
                "not yet achieved."
            )


if __name__ == "__main__":
    main()