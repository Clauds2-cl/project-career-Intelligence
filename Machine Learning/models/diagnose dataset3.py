from pathlib import Path

import numpy as np
import pandas as pd


BASE_DIR = Path(__file__).resolve().parent

WORKBOOK = BASE_DIR / "Claudia's Datasets Updated Academic Model.xlsx"

SHEET = "Dataset3_Skill_Gap_Analysis"


def entropy(series):
    counts = series.value_counts(dropna=True)

    if counts.empty:
        return 0.0

    probabilities = counts / counts.sum()

    return float(
        -sum(
            p * np.log2(p)
            for p in probabilities
            if p > 0
        )
    )


def main():

    print("=" * 70)
    print("DATASET 3 DIAGNOSTIC ANALYSIS")
    print("=" * 70)

    print(f"\nWorkbook: {WORKBOOK}")
    print(f"Sheet: {SHEET}")

    if not WORKBOOK.exists():
        raise FileNotFoundError(
            f"Workbook not found: {WORKBOOK}"
        )

    excel_file = pd.ExcelFile(WORKBOOK)

    if SHEET not in excel_file.sheet_names:
        raise ValueError(
            f"Sheet '{SHEET}' not found. "
            f"Available sheets: {excel_file.sheet_names}"
        )

    df = pd.read_excel(
        WORKBOOK,
        sheet_name=SHEET
    )

    df.columns = (
        df.columns
        .astype(str)
        .str.strip()
    )

    required_columns = {
        "Desired_Career",
        "Current_Skill",
        "Missing_Skill",
        "Recommended_Certification",
        "Skill_Gap_Level",
    }

    missing_columns = (
        required_columns - set(df.columns)
    )

    if missing_columns:
        raise ValueError(
            f"Missing required columns: "
            f"{sorted(missing_columns)}"
        )

    print("\nDATASET SHAPE")
    print("-" * 70)

    print(f"Rows: {len(df)}")
    print(f"Columns: {len(df.columns)}")

    print("\nCOLUMNS")
    print("-" * 70)

    for column in df.columns:
        print(f"- {column}")

    print("\nMISSING VALUES")
    print("-" * 70)

    missing = df.isnull().sum()

    for column, count in missing.items():
        print(f"{column}: {count}")

    print("\nDUPLICATE ROWS")
    print("-" * 70)

    print(
        f"Exact duplicate rows: "
        f"{df.duplicated().sum()}"
    )

    print("\nUNIQUE VALUES")
    print("-" * 70)

    for column in df.columns:

        print(
            f"{column}: "
            f"{df[column].nunique(dropna=True)} unique"
        )

    target = "Skill_Gap_Level"

    print("\nTARGET DISTRIBUTION")
    print("-" * 70)

    target_counts = df[target].value_counts(
        dropna=False
    )

    for label, count in target_counts.items():

        percentage = (
            count / len(df) * 100
            if len(df)
            else 0
        )

        print(
            f"{label}: "
            f"{count} "
            f"({percentage:.2f}%)"
        )

    print("\nMAJORITY CLASS BASELINE")
    print("-" * 70)

    if len(df) > 0 and not target_counts.empty:

        majority_count = target_counts.max()

        majority_label = target_counts.idxmax()

        majority_baseline = (
            majority_count / len(df)
        )

        print(
            f"Majority class: "
            f"{majority_label}"
        )

        print(
            f"Baseline accuracy: "
            f"{majority_baseline:.4f} "
            f"({majority_baseline * 100:.2f}%)"
        )

    else:

        print(
            "Dataset is empty; "
            "baseline cannot be calculated."
        )

    print("\nKEY FIELD CARDINALITY")
    print("-" * 70)

    important_columns = [
        "Desired_Career",
        "Current_Skill",
        "Missing_Skill",
        "Recommended_Certification",
        "Education_System",
        "Academic_Pathway",
        "Academic_Profile_Reference",
    ]

    for column in important_columns:

        if column in df.columns:

            print(
                f"{column}: "
                f"{df[column].nunique(dropna=True)} unique"
            )

    print("\nIDENTICAL INPUT COMBINATIONS")
    print("-" * 70)

    input_columns = [
        "Desired_Career",
        "Current_Skill",
        "Missing_Skill",
    ]

    grouped = (
        df.groupby(
            input_columns,
            dropna=False
        )[target]
        .agg(
            records="size",
            unique_labels="nunique"
        )
        .reset_index()
    )

    inconsistent = grouped[
        grouped["unique_labels"] > 1
    ]

    print(
        f"Unique input combinations: "
        f"{len(grouped)}"
    )

    print(
        f"Inconsistent combinations: "
        f"{len(inconsistent)}"
    )

    if len(grouped) > 0:

        percentage = (
            len(inconsistent)
            / len(grouped)
            * 100
        )

        print(
            f"Inconsistency rate: "
            f"{percentage:.2f}%"
        )

    print("\nTOP INCONSISTENT COMBINATIONS")
    print("-" * 70)

    if inconsistent.empty:

        print(
            "No inconsistent combinations found."
        )

    else:

        top_inconsistent = (
            inconsistent
            .sort_values(
                "records",
                ascending=False
            )
            .head(20)
        )

        for _, row in top_inconsistent.iterrows():

            mask = (
                (
                    df["Desired_Career"]
                    == row["Desired_Career"]
                )
                &
                (
                    df["Current_Skill"]
                    == row["Current_Skill"]
                )
                &
                (
                    df["Missing_Skill"]
                    == row["Missing_Skill"]
                )
            )

            labels = (
                df.loc[
                    mask,
                    target
                ]
                .value_counts()
                .to_dict()
            )

            print(
                f"\nCareer: "
                f"{row['Desired_Career']}"
            )

            print(
                f"Current Skill: "
                f"{row['Current_Skill']}"
            )

            print(
                f"Missing Skill: "
                f"{row['Missing_Skill']}"
            )

            print(
                f"Records: "
                f"{row['records']}"
            )

            print(
                f"Labels: "
                f"{labels}"
            )

    print("\nCAREER × TARGET")
    print("-" * 70)

    career_target = pd.crosstab(
        df["Desired_Career"],
        df[target],
        dropna=False
    )

    print(
        career_target.to_string()
    )

    print("\nCURRENT SKILL × TARGET")
    print("-" * 70)

    current_skill_target = pd.crosstab(
        df["Current_Skill"],
        df[target],
        dropna=False
    )

    print(
        current_skill_target.to_string()
    )

    print("\nMISSING SKILL × TARGET")
    print("-" * 70)

    missing_skill_target = pd.crosstab(
        df["Missing_Skill"],
        df[target],
        dropna=False
    )

    print(
        missing_skill_target.to_string()
    )

    print("\nTARGET ENTROPY")
    print("-" * 70)

    print(
        f"{target}: "
        f"{entropy(df[target]):.4f} bits"
    )

    entropy_columns = [
        "Desired_Career",
        "Current_Skill",
        "Missing_Skill",
        "Recommended_Certification",
    ]

    for column in entropy_columns:

        if column in df.columns:

            print(
                f"{column}: "
                f"{entropy(df[column]):.4f} bits"
            )

    print("\nSAMPLE RECORDS")
    print("-" * 70)

    if df.empty:

        print("Dataset is empty.")

    else:

        print(
            df.head(20)
            .to_string(index=False)
        )

    print(
        "\n" + "=" * 70
    )

    print(
        "DIAGNOSTIC COMPLETE"
    )

    print(
        "=" * 70
    )


if __name__ == "__main__":
    main()