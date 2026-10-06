"""
clean_datasets.py
------------------
Cleans the four sheets in `Claudia_s_Dataset_2000_records_CORRECTED.xlsx`:

    1. Dataset1_Course_Recommendation
    2. Dataset2_Career_Prediction
    3. Dataset3_Skill_Gap_Analysis
    4. Dataset4_Career_Readiness

For each sheet this script:
    - Strips whitespace and normalises text casing in string columns
    - Removes exact duplicate rows
    - Drops rows with missing values in key columns
    - Validates categorical values against an allowed set (drops/flags bad rows)
    - Clips numeric score columns to their expected range
    - Enforces correct dtypes (ints for IDs/scores, category for labels)
    - Saves a cleaned CSV per dataset into ./cleaned/

Run:
    python clean_datasets.py --input Claudia_s_Dataset_2000_records_CORRECTED.xlsx
"""

import argparse
import os
import sys

import pandas as pd

# ---------------------------------------------------------------------
# Reference / validation constants (must match the Kenyan schema)
# ---------------------------------------------------------------------

VALID_KCSE_GRADES = {"A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "D-", "E"}
VALID_EDUCATION_LEVELS = {"KCSE", "CBC"}
VALID_QUALIFICATION_LEVELS = {"Degree", "Diploma", "Certificate", "Retake/Artisan"}
VALID_INTERNSHIP = {"Yes", "No"}
VALID_SKILL_GAP = {"Low", "Medium", "High"}
VALID_READINESS = {"Needs Improvement", "Almost Ready", "Ready"}

SCORE_COLS_0_100 = ["Math", "English", "Science"]
SCORE_COLS_1_10 = ["Communication", "Problem_Solving", "Programming", "Leadership",
                    "CV_Quality", "Interview_Readiness"]


def log(msg: str) -> None:
    print(f"[clean] {msg}")


def strip_strings(df: pd.DataFrame) -> pd.DataFrame:
    """Trim whitespace on every string/object column."""
    for col in df.select_dtypes(include=["object", "string"]).columns:
        df[col] = df[col].astype(str).str.strip()
    return df


def drop_duplicates_and_na(df: pd.DataFrame, subset_required: list) -> pd.DataFrame:
    before = len(df)
    df = df.drop_duplicates()
    df = df.dropna(subset=subset_required)
    after = len(df)
    if before != after:
        log(f"  removed {before - after} duplicate/incomplete rows")
    return df


def clip_scores(df: pd.DataFrame) -> pd.DataFrame:
    for col in SCORE_COLS_0_100:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors="coerce").clip(0, 100)
    for col in SCORE_COLS_1_10:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors="coerce").clip(1, 10)
    return df


def keep_valid_categories(df: pd.DataFrame, col: str, allowed: set) -> pd.DataFrame:
    if col not in df.columns:
        return df
    before = len(df)
    df = df[df[col].isin(allowed)]
    after = len(df)
    if before != after:
        log(f"  dropped {before - after} rows with invalid '{col}' values")
    return df


# ---------------------------------------------------------------------
# Per-dataset cleaning
# ---------------------------------------------------------------------

def clean_dataset1(df: pd.DataFrame) -> pd.DataFrame:
    log("Cleaning Dataset1_Course_Recommendation")
    df = strip_strings(df)
    df["Student_ID"] = pd.to_numeric(df["Student_ID"], errors="coerce")
    required = ["Student_ID", "KCSE_Grade", "Interest_Area", "Recommended_Course"]
    df = drop_duplicates_and_na(df, required)
    df = keep_valid_categories(df, "KCSE_Grade", VALID_KCSE_GRADES)
    df = keep_valid_categories(df, "Education_Level", VALID_EDUCATION_LEVELS)
    if "Qualification_Level" in df.columns:
        df = keep_valid_categories(df, "Qualification_Level", VALID_QUALIFICATION_LEVELS)
    df = clip_scores(df)
    df["Student_ID"] = df["Student_ID"].astype(int)
    for col in ["Education_Level", "KCSE_Grade", "Qualification_Level", "Interest_Area",
                "Personality", "Recommended_Course"]:
        if col in df.columns:
            df[col] = df[col].astype("category")
    return df.reset_index(drop=True)


def clean_dataset2(df: pd.DataFrame) -> pd.DataFrame:
    log("Cleaning Dataset2_Career_Prediction")
    df = strip_strings(df)
    df["Student_ID"] = pd.to_numeric(df["Student_ID"], errors="coerce")
    df["Year"] = pd.to_numeric(df["Year"], errors="coerce")
    required = ["Student_ID", "Current_Course", "Year", "Recommended_Career"]
    df = drop_duplicates_and_na(df, required)
    df = df[df["Year"].between(1, 4)]
    df = clip_scores(df)
    df["Student_ID"] = df["Student_ID"].astype(int)
    df["Year"] = df["Year"].astype(int)
    for col in ["Current_Course", "Degree_Classification", "Interest_Area", "Personality",
                "Recommended_Career"]:
        if col in df.columns:
            df[col] = df[col].astype("category")
    return df.reset_index(drop=True)


def clean_dataset3(df: pd.DataFrame) -> pd.DataFrame:
    log("Cleaning Dataset3_Skill_Gap_Analysis")
    df = strip_strings(df)
    df["Student_ID"] = pd.to_numeric(df["Student_ID"], errors="coerce")
    required = ["Student_ID", "Desired_Career", "Skill_Gap_Level"]
    df = drop_duplicates_and_na(df, required)
    df = keep_valid_categories(df, "Skill_Gap_Level", VALID_SKILL_GAP)
    df["Student_ID"] = df["Student_ID"].astype(int)
    for col in ["Desired_Career", "Current_Skill", "Missing_Skill",
                "Recommended_Certification", "Skill_Gap_Level"]:
        if col in df.columns:
            df[col] = df[col].astype("category")
    return df.reset_index(drop=True)


def clean_dataset4(df: pd.DataFrame) -> pd.DataFrame:
    log("Cleaning Dataset4_Career_Readiness")
    df = strip_strings(df)
    df["Student_ID"] = pd.to_numeric(df["Student_ID"], errors="coerce")
    required = ["Student_ID", "Career_Readiness_Score", "Readiness_Status"]
    df = drop_duplicates_and_na(df, required)
    df = keep_valid_categories(df, "Internship", VALID_INTERNSHIP)
    df = keep_valid_categories(df, "Readiness_Status", VALID_READINESS)
    df = clip_scores(df)
    df["Career_Readiness_Score"] = pd.to_numeric(
        df["Career_Readiness_Score"], errors="coerce"
    ).clip(0, 100)
    df["Student_ID"] = df["Student_ID"].astype(int)
    for col in ["Certification", "Internship", "Readiness_Status"]:
        if col in df.columns:
            df[col] = df[col].astype("category")
    return df.reset_index(drop=True)


CLEANERS = {
    "Dataset1_Course_Recommendation": clean_dataset1,
    "Dataset2_Career_Prediction": clean_dataset2,
    "Dataset3_Skill_Gap_Analysis": clean_dataset3,
    "Dataset4_Career_Readiness": clean_dataset4,
}


def main():
    parser = argparse.ArgumentParser(description="Clean the four Kenyan student datasets.")
    parser.add_argument(
        "--input",
        default="Claudia_s_Dataset_2000_records_CORRECTED.xlsx",
        help="Path to the source Excel workbook.",
    )
    parser.add_argument(
        "--outdir", default="cleaned", help="Directory to write cleaned CSVs into."
    )
    args = parser.parse_args()

    if not os.path.exists(args.input):
        sys.exit(f"Input file not found: {args.input}")

    os.makedirs(args.outdir, exist_ok=True)
    xls = pd.ExcelFile(args.input)

    for sheet_name, cleaner in CLEANERS.items():
        if sheet_name not in xls.sheet_names:
            log(f"WARNING: sheet '{sheet_name}' not found, skipping")
            continue
        raw = pd.read_excel(xls, sheet_name=sheet_name)
        cleaned = cleaner(raw)
        out_path = os.path.join(args.outdir, f"{sheet_name}_clean.csv")
        cleaned.to_csv(out_path, index=False)
        log(f"  -> saved {len(cleaned)} rows to {out_path}\n")

    log("Done.")


if __name__ == "__main__":
    main()