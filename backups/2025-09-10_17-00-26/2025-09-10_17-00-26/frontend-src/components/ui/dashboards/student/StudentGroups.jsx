import ChatWindow from "../../chat/ChatWindow";

export default function StudentGroups({ selectedTeacher }) {
  const studentId = "student123"; // Replace with real auth user ID
  const currentUserId = studentId;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Teacher Chat</h2>
      {selectedTeacher ? (
        <ChatWindow
          teacherId={selectedTeacher.id}
          studentId={studentId}
          currentUserId={currentUserId}
        />
      ) : (
        <p>Select a teacher to start chatting</p>
      )}
    </div>
  );
}
