import React, { useState } from "react";

const TeacherSettings = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [autoGradeUpload, setAutoGradeUpload] = useState(false);

  return (
    <div className="dashboard-card p-6 bg-black/30 rounded-2xl shadow-md w-full max-w-4xl mx-auto text-white">
      <h1 className="text-2xl font-semibold mb-6">Settings</h1>

      <section className="space-y-6 max-w-md">
        <div className="flex items-center justify-between">
          <label htmlFor="emailNotifications" className="font-medium">
            Email Notifications
          </label>
          <input
            type="checkbox"
            id="emailNotifications"
            checked={emailNotifications}
            onChange={() => setEmailNotifications(!emailNotifications)}
            className="switch"
          />
        </div>

        <div className="flex items-center justify-between">
          <label htmlFor="darkMode" className="font-medium">
            Enable Dark Mode
          </label>
          <input
            type="checkbox"
            id="darkMode"
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
            className="switch"
          />
        </div>

        <div className="flex items-center justify-between">
          <label htmlFor="autoGradeUpload" className="font-medium">
            Automatic Grade Upload
          </label>
          <input
            type="checkbox"
            id="autoGradeUpload"
            checked={autoGradeUpload}
            onChange={() => setAutoGradeUpload(!autoGradeUpload)}
            className="switch"
          />
        </div>
      </section>

      <p className="mt-8 text-gray-400 text-sm italic max-w-md">
        These settings will help customize your teacher dashboard experience.
      </p>
    </div>
  );
};

export default TeacherSettings;
