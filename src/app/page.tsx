"use client";

import { useState } from "react";

export default function Home() {
  const [showForm, setShowForm] = useState(false);

  const [skillName, setSkillName] = useState("");
  const [skillProgress, setSkillProgress] = useState("50");

  const [editingSkill, setEditingSkill] = useState("");
  const [editProgress, setEditProgress] = useState("50");

  const [skills, setSkills] = useState([
    { name: "Java", progress: 70 },
    { name: "React", progress: 40 },
    { name: "SQL", progress: 25 },
  ]);

  const [activities, setActivities] = useState([
    "Started learning Java",
    "Started learning React",
    "Started learning SQL",
  ]);

  function addSkill() {
    if (skillName === "") {
      return;
    }

    const newSkill = {
      name: skillName,
      progress: Number(skillProgress),
    };

    setSkills([...skills, newSkill]);

    setActivities([
      `Added ${skillName}`,
      ...activities,
    ]);

    setSkillName("");
    setSkillProgress("50");
    setShowForm(false);
  }

  function deleteSkill(skillName: string) {
    const updatedSkills = skills.filter(
      (skill) => skill.name !== skillName
    );

    setSkills(updatedSkills);
  }

  function editSkill(skillName: string, progress: number) {
    setEditingSkill(skillName);
    setEditProgress(progress.toString());
  }

  function updateSkill() {
    const updatedSkills = skills.map((skill) => {
      if (skill.name === editingSkill) {
        return {
          name: skill.name,
          progress: Number(editProgress),
        };
      }

      return skill;
    });

    setSkills(updatedSkills);
    setEditingSkill("");
  }

  return (
    <main className="min-h-screen bg-gray-950 p-8 text-white">

      <h1 className="text-4xl font-bold text-blue-400">
        SkillPath
      </h1>

      <p className="mt-2 text-gray-400">
        Track your learning and build your skills.
      </p>

      <button
        onClick={() => setShowForm(true)}
        className="mt-6 rounded-lg bg-blue-600 px-5 py-3 font-bold hover:bg-blue-700"
      >
        + Add Skill
      </button>

      {showForm && (
        <div className="mt-5 rounded-xl bg-gray-900 p-6">

          <h2 className="text-xl font-bold">
            Add a Skill
          </h2>

          <input
            type="text"
            placeholder="Skill name"
            value={skillName}
            onChange={(event) => setSkillName(event.target.value)}
            className="mt-4 w-full rounded-lg bg-gray-800 p-3 text-white"
          />

          <label className="mt-4 block text-gray-300">
            Progress: {skillProgress}%
          </label>

          <input
            type="range"
            min="0"
            max="100"
            value={skillProgress}
            onChange={(event) => setSkillProgress(event.target.value)}
            className="mt-2 w-full"
          />

          <button
            onClick={addSkill}
            className="mt-4 rounded-lg bg-green-600 px-5 py-3 font-bold hover:bg-green-700"
          >
            Save Skill
          </button>

        </div>
      )}

      <h2 className="mt-10 text-2xl font-bold">
        My Skills
      </h2>

      <div className="mt-5 grid gap-5 md:grid-cols-3">

        {skills.map((skill) => (
          <div
            key={skill.name}
            className="rounded-xl bg-gray-900 p-6 shadow-lg"
          >

            <h3 className="text-xl font-bold">
              {skill.name}
            </h3>

            <p className="mt-1 text-gray-400">
              Learning
            </p>

            <div className="mt-5 h-3 rounded-full bg-gray-700">

              <div
                className="h-3 rounded-full bg-blue-500"
                style={{ width: `${skill.progress}%` }}
              >
              </div>

            </div>

            <p className="mt-2 text-gray-400">
              {skill.progress}% complete
            </p>

            <button
              onClick={() => editSkill(skill.name, skill.progress)}
              className="mr-2 mt-4 rounded-lg bg-yellow-600 px-4 py-2 font-bold hover:bg-yellow-700"
            >
              Edit
            </button>

            <button
              onClick={() => deleteSkill(skill.name)}
              className="mt-4 rounded-lg bg-red-600 px-4 py-2 font-bold hover:bg-red-700"
            >
              Delete
            </button>

            {editingSkill === skill.name && (
              <div className="mt-4">

                <p className="text-gray-300">
                  Progress: {editProgress}%
                </p>

                <input
                  type="range"
                  min="0"
                  max="100"
                  value={editProgress}
                  onChange={(event) =>
                    setEditProgress(event.target.value)
                  }
                  className="mt-2 w-full"
                />

                <button
                  onClick={updateSkill}
                  className="mt-3 rounded-lg bg-green-600 px-4 py-2 font-bold hover:bg-green-700"
                >
                  Update
                </button>

              </div>
            )}

          </div>
        ))}

      </div>

      <h2 className="mt-10 text-2xl font-bold">
        Recent Activity
      </h2>

      <div className="mt-5 rounded-xl bg-gray-900 p-6">

        {activities.map((activity, index) => (
          <div
            key={index}
            className="border-b border-gray-700 py-4 last:border-b-0"
          >

            <p className="font-bold">
              {activity}
            </p>

            <p className="mt-1 text-gray-400">
              Recent activity
            </p>

          </div>
        ))}

      </div>

    </main>
  );
}