
"use client";

import { useEffect, useState } from "react";

type Skill = {
  id: string;
  name: string;
  progress: number;
};

type Activity = {
  id: string;
  message: string;
  date: string;
};

export default function Home() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loaded, setLoaded] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [skillName, setSkillName] = useState("");
  const [skillProgress, setSkillProgress] = useState("0");

  const [editingSkill, setEditingSkill] = useState("");
  const [editProgress, setEditProgress] = useState("0");

  useEffect(() => {
    try {
      const savedSkills = localStorage.getItem("skillpath-skills");
      const savedActivities = localStorage.getItem("skillpath-activities");

      if (savedSkills) {
        setSkills(JSON.parse(savedSkills));
      }

      if (savedActivities) {
        setActivities(JSON.parse(savedActivities));
      }
    } catch {
      console.log("Could not load saved data.");
    }

    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem("skillpath-skills", JSON.stringify(skills));
      localStorage.setItem(
        "skillpath-activities",
        JSON.stringify(activities),
      );
    }
  }, [skills, activities, loaded]);

  function addActivity(message: string) {
    const newActivity: Activity = {
      id: Date.now().toString(),
      message,
      date: new Date().toLocaleString(),
    };

    setActivities((current) => [newActivity, ...current].slice(0, 10));
  }

  function addSkill() {
    const name = skillName.trim();
    const progress = Number(skillProgress);

    if (!name) {
      alert("Please enter a skill name.");
      return;
    }

    if (skills.some((skill) => skill.name.toLowerCase() === name.toLowerCase())) {
      alert("This skill already exists.");
      return;
    }

    if (!Number.isInteger(progress) || progress < 0 || progress > 100) {
      alert("Progress must be between 0 and 100.");
      return;
    }

    const newSkill: Skill = {
      id: Date.now().toString(),
      name,
      progress,
    };

    setSkills((current) => [...current, newSkill]);
    addActivity(`Added ${name}`);
    setSkillName("");
    setSkillProgress("0");
    setShowForm(false);
  }

  function saveProgress(id: string) {
    const progress = Number(editProgress);
    const skill = skills.find((item) => item.id === id);

    if (!skill) return;

    if (!Number.isInteger(progress) || progress < 0 || progress > 100) {
      alert("Progress must be between 0 and 100.");
      return;
    }

    setSkills((current) =>
      current.map((item) =>
        item.id === id ? { ...item, progress } : item,
      ),
    );

    addActivity(`Updated ${skill.name} progress to ${progress}%`);
    setEditingSkill("");
  }

  function deleteSkill(id: string) {
    const skill = skills.find((item) => item.id === id);

    if (!skill) return;

    if (!confirm(`Are you sure you want to delete ${skill.name}?`)) {
      return;
    }

    setSkills((current) => current.filter((item) => item.id !== id));
    addActivity(`Deleted ${skill.name}`);
  }

  const totalSkills = skills.length;

  const completedSkills = skills.filter(
    (skill) => skill.progress === 100,
  ).length;

  const averageProgress =
    totalSkills === 0
      ? 0
      : Math.round(
          skills.reduce((total, skill) => total + skill.progress, 0) /
            totalSkills,
        );

  if (!loaded) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-lg text-slate-600">Loading SkillPath...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800">
      <header className="bg-gradient-to-r from-indigo-700 to-violet-600 text-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 px-6 py-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">SkillPath</h1>
            <p className="mt-2 text-indigo-100">
              Your journey to learning new skills starts here.
            </p>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className="rounded-xl bg-white px-5 py-3 font-semibold text-indigo-700 shadow transition hover:bg-indigo-50"
          >
            {showForm ? "Cancel" : "+ Add New Skill"}
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-8">
        <section className="mb-8">
          <h2 className="text-2xl font-bold">Welcome to your dashboard!</h2>
          <p className="mt-2 text-slate-600">
            Keep track of your learning and see how far you have come.
          </p>
        </section>

        <section className="mb-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-indigo-100 bg-white p-6 shadow-sm">
            <div className="mb-3 text-3xl">📚</div>
            <p className="text-sm font-medium text-slate-500">Total Skills</p>
            <p className="mt-2 text-3xl font-bold text-indigo-700">
              {totalSkills}
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
            <div className="mb-3 text-3xl">🏆</div>
            <p className="text-sm font-medium text-slate-500">
              Completed Skills
            </p>
            <p className="mt-2 text-3xl font-bold text-emerald-600">
              {completedSkills}
            </p>
          </div>

          <div className="rounded-2xl border border-violet-100 bg-white p-6 shadow-sm">
            <div className="mb-3 text-3xl">📈</div>
            <p className="text-sm font-medium text-slate-500">
              Overall Progress
            </p>
            <p className="mt-2 text-3xl font-bold text-violet-700">
              {averageProgress}%
            </p>
          </div>
        </section>

        {showForm && (
          <section className="mb-8 rounded-2xl border border-indigo-100 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-bold">Add a New Skill</h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Skill Name
                </label>
                <input
                  type="text"
                  value={skillName}
                  onChange={(event) => setSkillName(event.target.value)}
                  placeholder="Example: JavaScript"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Progress (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={skillProgress}
                  onChange={(event) => setSkillProgress(event.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>

            <button
              onClick={addSkill}
              className="mt-5 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700"
            >
              Save Skill
            </button>
          </section>
        )}

        <section className="mb-8">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">My Skills</h2>
              <p className="mt-1 text-sm text-slate-500">
                Track your progress one step at a time.
              </p>
            </div>
          </div>

          {skills.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-white px-6 py-12 text-center">
              <div className="mb-3 text-5xl">🚀</div>
              <h3 className="text-lg font-bold">Start your learning journey</h3>
              <p className="mx-auto mt-2 max-w-md text-slate-500">
                You have not added any skills yet. Add your first skill to
                start tracking your progress.
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="mt-5 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700"
              >
                + Add Your First Skill
              </button>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              {skills.map((skill) => (
                <div
                  key={skill.id}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
                >
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-bold">{skill.name}</h3>
                      <p className="mt-1 text-sm text-slate-500">
                        {skill.progress === 100
                          ? "Skill completed!"
                          : "Keep learning and improving"}
                      </p>
                    </div>

                    <span className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-700">
                      {skill.progress}%
                    </span>
                  </div>

                  <div className="mb-5 h-3 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-500"
                      style={{ width: `${skill.progress}%` }}
                    />
                  </div>

                  {editingSkill === skill.id ? (
                    <div className="flex flex-wrap items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={editProgress}
                        onChange={(event) =>
                          setEditProgress(event.target.value)
                        }
                        className="w-24 rounded-lg border border-slate-300 px-3 py-2"
                      />

                      <button
                        onClick={() => saveProgress(skill.id)}
                        className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                      >
                        Save
                      </button>

                      <button
                        onClick={() => setEditingSkill("")}
                        className="rounded-lg border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => {
                          setEditingSkill(skill.id);
                          setEditProgress(String(skill.progress));
                        }}
                        className="rounded-lg bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-100"
                      >
                        Update Progress
                      </button>

                      <button
                        onClick={() => deleteSkill(skill.id)}
                        className="rounded-lg bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Recent Activity</h2>
              <p className="mt-1 text-sm text-slate-500">
                Your latest learning updates.
              </p>
            </div>
            <span className="text-2xl">🕒</span>
          </div>

          {activities.length === 0 ? (
            <p className="rounded-xl bg-slate-50 p-5 text-center text-slate-500">
              Your activity will appear here when you add or update a skill.
            </p>
          ) : (
            <div className="space-y-4">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex gap-3 border-b border-slate-100 pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-50">
                    <span>✓</span>
                  </div>
                  <div>
                    <p className="font-medium">{activity.message}</p>
                    <p className="mt-1 text-sm text-slate-400">
                      {activity.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <footer className="py-8 text-center text-sm text-slate-400">
          SkillPath · Keep learning, keep growing.
        </footer>
      </div>
    </main>
  );
}
