from pathlib import Path
import pandas as pd


BASE_DIR = Path(__file__).resolve().parent

REQUIREMENTS_FILE = BASE_DIR / "Career Skill Requirements.xlsx"

PROFICIENCY_LEVELS = {
    "Beginner": 1,
    "Basic": 1,
    "Intermediate": 2,
    "Advanced": 3,
    "Expert": 4,
}

LEVEL_NAMES = {
    1: "Beginner",
    2: "Intermediate",
    3: "Advanced",
    4: "Expert",
}


class SkillGapEngine:

    def __init__(self, requirements_path=REQUIREMENTS_FILE):

        self.requirements_path = Path(requirements_path)

        if not self.requirements_path.exists():
            raise FileNotFoundError(
                f"Requirements file not found: "
                f"{self.requirements_path}"
            )

        self.requirements = pd.read_excel(
            self.requirements_path,
            sheet_name="Skill_Requirements"
        )

        self.requirements.columns = (
            self.requirements.columns.str.strip()
        )

        required_columns = {
            "Desired_Career",
            "Skill",
            "Required_Level",
            "Required_Level_Name",
        }

        missing = required_columns - set(
            self.requirements.columns
        )

        if missing:
            raise ValueError(
                f"Missing columns: {sorted(missing)}"
            )

        self.requirements = self.requirements.dropna(
            subset=[
                "Desired_Career",
                "Skill",
                "Required_Level"
            ]
        )

    def normalize_proficiency(self, proficiency):

        if isinstance(proficiency, str):

            value = proficiency.strip()

            if value in PROFICIENCY_LEVELS:
                return PROFICIENCY_LEVELS[value]

            try:
                proficiency = int(value)
            except ValueError:
                raise ValueError(
                    f"Invalid proficiency: {proficiency}"
                )

        if isinstance(proficiency, (int, float)):

            proficiency = int(proficiency)

            if 1 <= proficiency <= 4:
                return proficiency

        raise ValueError(
            "Proficiency must be Beginner, Basic, "
            "Intermediate, Advanced, Expert, or 1-4."
        )

    def get_career_requirements(self, career):

        career_mask = (
            self.requirements["Desired_Career"]
            .astype(str)
            .str.strip()
            .str.lower()
            == career.strip().lower()
        )

        career_data = self.requirements[
            career_mask
        ].copy()

        if career_data.empty:
            raise ValueError(
                f"Career '{career}' was not found."
            )

        return career_data

    def calculate_gap(
        self,
        current_level,
        required_level
    ):

        gap_score = max(
            required_level - current_level,
            0
        )

        if gap_score == 0:
            gap_level = "No Gap"
        elif gap_score == 1:
            gap_level = "Low"
        elif gap_score == 2:
            gap_level = "Medium"
        else:
            gap_level = "High"

        return {
            "current_level": current_level,
            "current_level_name": (
                "None"
                if current_level == 0
                else LEVEL_NAMES[current_level]
            ),
            "required_level": required_level,
            "required_level_name": LEVEL_NAMES[
                required_level
            ],
            "gap_score": gap_score,
            "gap_level": gap_level,
        }

    def get_certifications(self, career):

        try:

            certifications = pd.read_excel(
                self.requirements_path,
                sheet_name="Certifications"
            )

        except Exception:
            return []

        certifications.columns = (
            certifications.columns.str.strip()
        )

        career_mask = (
            certifications["Desired_Career"]
            .astype(str)
            .str.strip()
            .str.lower()
            == career.strip().lower()
        )

        results = certifications[
            career_mask
        ]["Recommended_Certification"].dropna()

        return list(
            dict.fromkeys(
                str(value).strip()
                for value in results
                if str(value).strip()
            )
        )

    def analyze(
        self,
        career,
        current_skills
    ):

        requirements = self.get_career_requirements(
            career
        )

        current_skill_map = {}

        for item in current_skills:

            skill = str(
                item["skill"]
            ).strip()

            if not skill:
                continue

            current_skill_map[
                skill.lower()
            ] = {
                "skill": skill,
                "proficiency": self.normalize_proficiency(
                    item["proficiency"]
                ),
            }

        results = []

        for _, row in requirements.iterrows():

            skill = str(
                row["Skill"]
            ).strip()

            required_level = int(
                row["Required_Level"]
            )

            skill_key = skill.lower()

            if skill_key in current_skill_map:

                current_level = current_skill_map[
                    skill_key
                ]["proficiency"]

            else:

                current_level = 0

            gap = self.calculate_gap(
                current_level,
                required_level
            )

            results.append({
                "skill": skill,
                **gap,
            })

        results.sort(
            key=lambda item: (
                -item["gap_score"],
                item["skill"]
            )
        )

        summary = {
            "No Gap": 0,
            "Low": 0,
            "Medium": 0,
            "High": 0,
        }

        for result in results:
            summary[
                result["gap_level"]
            ] += 1

        certifications = self.get_certifications(
            career
        )

        return {
            "career": career,
            "skills_analyzed": len(results),
            "summary": summary,
            "skill_gaps": results,
            "recommended_certifications": certifications,
        }


if __name__ == "__main__":

    engine = SkillGapEngine()

    result = engine.analyze(
        career="Software Engineer",
        current_skills=[
            {
                "skill": "Cloud Computing",
                "proficiency": "Advanced",
            },
            {
                "skill": "DevOps",
                "proficiency": "Beginner",
            },
            {
                "skill": "System Design",
                "proficiency": "Intermediate",
            },
        ],
    )

    print()
    print("CAREER:")
    print(result["career"])

    print()
    print("SUMMARY:")

    for level, count in result["summary"].items():
        print(f"{level}: {count}")

    print()
    print("SKILL GAPS:")

    for gap in result["skill_gaps"]:

        print(
            f"{gap['skill']} | "
            f"Current: {gap['current_level_name']} | "
            f"Required: {gap['required_level_name']} | "
            f"Gap: {gap['gap_level']}"
        )

    print()
    print("CERTIFICATIONS:")

    for certification in result[
        "recommended_certifications"
    ]:
        print(f"- {certification}")