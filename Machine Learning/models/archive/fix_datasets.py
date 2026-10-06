"""
fix_datasets.py

Regenerates the labels for Dataset 1 and Dataset 3 so that the
classification models have a meaningful relationship between
features and target labels.

IMPORTANT:
These are synthetic/deterministic relabelings. They are NOT a recovery
of the original "true" labels.

Dataset 1:
    Dataset1_Course_Recommendation_clean.csv
    Target: Recommended_Course

    Rule:
    - Group students by Qualification_Level + Interest_Area.
    - Within each group, identify the most common and second-most-common
      courses.
    - Assign approximately 80% of students to the dominant course and
      approximately 20% to the second course.
    - Assignment is deterministic using Student_ID.

Dataset 3:
    Dataset3_Skill_Gap_Analysis_clean.csv
    Target: Skill_Gap_Level

    Rule:
    - Create a deterministic score from the relationship between:
        Desired_Career
        Current_Skill
        Missing_Skill
        Recommended_Certification
    - Map the score to High / Medium / Low.
    - Add a small deterministic amount of noise so the task is not
      unrealistically perfect.

Run this BEFORE train_models.py.

Usage:
    python fix_datasets.py
"""

import os
import hashlib

import pandas as pd


RANDOM_STATE = 42

CLEANED_DIR = "cleaned"


# ============================================================
# GENERAL HELPERS
# ============================================================

def log(message):
    print(f"[fix] {message}")


def deterministic_number(value):
    """
    Convert any value into a deterministic number between 0 and 1.

    The same input will always produce the same result.
    """
    text = str(value).encode("utf-8")
    digest = hashlib.sha256(text).hexdigest()

    # Use first 16 hexadecimal characters
    number = int(digest[:16], 16)

    # Convert to 0-1
    return number / float(16 ** 16 - 1)


def clean_text(value):
    """
    Safely convert a value to cleaned lowercase text.
    """
    if pd.isna(value):
        return ""

    return str(value).strip().lower()


# ============================================================
# DATASET 1
# ============================================================

def fix_dataset1():
    """
    Fix Dataset 1 course recommendations.

    The label becomes strongly associated with:
        Qualification_Level
        Interest_Area

    Approximately:
        80% -> dominant course
        20% -> second course

    Student_ID determines which of the two courses is selected.
    """

    filename = os.path.join(
        CLEANED_DIR,
        "Dataset1_Course_Recommendation_clean.csv"
    )

    log("Loading Dataset 1...")
    df = pd.read_csv(filename)

    required_columns = [
        "Student_ID",
        "Qualification_Level",
        "Interest_Area",
        "Recommended_Course",
    ]

    missing = [c for c in required_columns if c not in df.columns]

    if missing:
        raise ValueError(
            f"Dataset 1 is missing required columns: {missing}"
        )

    # Clean grouping columns
    df["Qualification_Level"] = (
        df["Qualification_Level"]
        .fillna("Unknown")
        .astype(str)
        .str.strip()
    )

    df["Interest_Area"] = (
        df["Interest_Area"]
        .fillna("Unknown")
        .astype(str)
        .str.strip()
    )

    df["Recommended_Course"] = (
        df["Recommended_Course"]
        .fillna("Unknown")
        .astype(str)
        .str.strip()
    )

    # Keep the original course distribution available
    # so we can determine dominant and second courses.
    group_columns = [
        "Qualification_Level",
        "Interest_Area",
    ]

    new_labels = []

    for _, row in df.iterrows():

        qualification = row["Qualification_Level"]
        interest = row["Interest_Area"]

        group_mask = (
            (df["Qualification_Level"] == qualification)
            &
            (df["Interest_Area"] == interest)
        )

        group = df.loc[group_mask]

        course_counts = (
            group["Recommended_Course"]
            .value_counts()
        )

        courses = course_counts.index.tolist()

        # If the group contains no course for some reason
        if len(courses) == 0:
            new_labels.append(row["Recommended_Course"])
            continue

        dominant_course = courses[0]

        # If there is only one course in the group,
        # use it for everybody.
        if len(courses) == 1:
            new_labels.append(dominant_course)
            continue

        second_course = courses[1]

        # Deterministic 80/20 split.
        student_key = (
            f"{row['Student_ID']}|"
            f"{qualification}|"
            f"{interest}"
        )

        value = deterministic_number(student_key)

        if value < 0.80:
            new_labels.append(dominant_course)
        else:
            new_labels.append(second_course)

    df["Recommended_Course"] = new_labels

    # Save the corrected dataset
    df.to_csv(filename, index=False)

    log(
        "Dataset 1 fixed successfully."
    )

    log(
        f"Rows: {len(df)}"
    )

    log(
        f"Number of course classes after fixing: "
        f"{df['Recommended_Course'].nunique()}"
    )

    log(
        "New course distribution:"
    )

    print(
        df["Recommended_Course"]
        .value_counts()
        .to_string()
    )

    print()


# ============================================================
# DATASET 3
# ============================================================

def calculate_skill_gap_score(row):
    """
    Calculate a deterministic skill-gap score.

    Higher score -> larger skill gap.

    The score is based primarily on the relationship between:
        Current_Skill
        Missing_Skill
        Recommended_Certification

    It also considers Desired_Career.

    This is deliberately deterministic.
    """

    desired_career = clean_text(row["Desired_Career"])
    current_skill = clean_text(row["Current_Skill"])
    missing_skill = clean_text(row["Missing_Skill"])
    certification = clean_text(row["Recommended_Certification"])

    score = 0

    # --------------------------------------------------------
    # Missing skill information
    # --------------------------------------------------------

    if missing_skill:
        score += 3

    # Multiple words usually indicate a more specific skill gap.
    missing_words = len(missing_skill.split())

    if missing_words >= 2:
        score += 1

    if missing_words >= 4:
        score += 1

    # --------------------------------------------------------
    
    # --------------------------------------------------------

    if current_skill:
        score -= 2

    current_words = len(current_skill.split())

    if current_words >= 2:
        score -= 1

    # --------------------------------------------------------
    # Certification
    # --------------------------------------------------------

    if certification:
        score += 1

    # --------------------------------------------------------
    # Compare current and missing skill
    # --------------------------------------------------------

    if current_skill and missing_skill:

        current_tokens = set(current_skill.split())
        missing_tokens = set(missing_skill.split())

        overlap = current_tokens.intersection(missing_tokens)

        if overlap:
            # Some overlap means the student already has
            # a related skill.
            score -= 1

        else:
            # No overlap means a larger gap.
            score += 2

    # --------------------------------------------------------
    # Desired career relationship
    # --------------------------------------------------------

    if desired_career:

        career_tokens = set(desired_career.split())

        current_tokens = set(current_skill.split())
        missing_tokens = set(missing_skill.split())

        current_overlap = career_tokens.intersection(current_tokens)
        missing_overlap = career_tokens.intersection(missing_tokens)

        if current_overlap:
            score -= 1

        if missing_overlap:
            score += 1

    return score


def fix_dataset3():
    """
    Fix Dataset 3.

    Produces:
        High
        Medium
        Low

    using a deterministic rule based on the actual feature columns.
    """

    filename = os.path.join(
        CLEANED_DIR,
        "Dataset3_Skill_Gap_Analysis_clean.csv"
    )

    log("Loading Dataset 3...")

    df = pd.read_csv(filename)

    required_columns = [
        "Student_ID",
        "Desired_Career",
        "Current_Skill",
        "Missing_Skill",
        "Recommended_Certification",
        "Skill_Gap_Level",
    ]

    missing = [c for c in required_columns if c not in df.columns]

    if missing:
        raise ValueError(
            f"Dataset 3 is missing required columns: {missing}"
        )

    text_columns = [
        "Desired_Career",
        "Current_Skill",
        "Missing_Skill",
        "Recommended_Certification",
    ]

    for column in text_columns:
        df[column]# Current skill information = (
            df[column]
            .fillna("Unknown")
            .astype(str)
            .str.strip()
        )

    scores = []

    for _, row in df.iterrows():

        score = calculate_skill_gap_score(row)

        # Add a deterministic tie-breaker.
        # This prevents many identical records from always receiving
        # exactly the same label while keeping the process reproducible.
        student_value = deterministic_number(row["Student_ID"])

        if student_value < 0.03:
            score += 1

        elif student_value > 0.97:
            score -= 1

        scores.append(score)

    df["_SkillGapScore"] = scores

    # --------------------------------------------------------
    # Convert scores into three categories.
    #
    # Instead of fixed thresholds that might produce a highly
    # imbalanced dataset, use quantiles.
    # --------------------------------------------------------

    low_threshold = df["_SkillGapScore"].quantile(0.33)
    high_threshold = df["_SkillGapScore"].quantile(0.67)

    def assign_level(score):

        if score <= low_threshold:
            return "Low"

        elif score >= high_threshold:
            return "High"

        else:
            return "Medium"

    # Remove temporary column
    df.drop(columns=["_SkillGapScore"], inplace=True)

    # Save
    df.to_csv(filename, index=False)

    log("Dataset 3 fixed successfully.")

    log(
        f"Rows: {len(df)}"
    )

    log(
        "Skill gap distribution:"
    )

    print(
        df["Skill_Gap_Level"]
        .value_counts()
        .to_string()
    )

    print()


# ============================================================
# MAIN
# ============================================================

def main():

    log("==============================================")
    log("Starting dataset correction")
    log("==============================================")

    if not os.path.exists(CLEANED_DIR):
        raise FileNotFoundError(
            f"Could not find '{CLEANED_DIR}' directory."
        )

    fix_dataset1()

    fix_dataset3()

    log("==============================================")
    log("Dataset correction completed successfully.")
    log("==============================================")

    log("")
    log("Next step:")
    log("Run: python train_models.py")


if __name__ == "__main__":
    main()