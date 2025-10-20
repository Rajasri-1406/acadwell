import React, { useEffect, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../../../firebase";
import { useNavigate } from "react-router-dom";

const ContactList = () => {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const currentUserId = localStorage.getItem("userId");
  const currentRole = localStorage.getItem("role");

  useEffect(() => {
    let q;

    if (currentRole === "teacher") {
      // ✅ Fetch all students linked to this teacher
      q = query(collection(db, "users"), where("teacherId", "==", currentUserId));
    } else if (currentRole === "student") {
      // ✅ Fetch teacher assigned to this student
      q = query(
        collection(db, "users"),
        where("role", "==", "teacher")
      );
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setContacts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, [currentRole, currentUserId]);

  const handleOpenChat = (contactId) => {
    const teacherId = currentRole === "teacher" ? currentUserId : contactId;
    const studentId = currentRole === "student" ? currentUserId : contactId;

    navigate(`/chat/${teacherId}/${studentId}`);
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-3">Contacts</h2>
      {contacts.length === 0 ? (
        <p className="text-gray-500">No contacts found.</p>
      ) : (
        <ul className="space-y-2">
          {contacts.map((contact) => (
            <li
              key={contact.id}
              onClick={() => handleOpenChat(contact.id)}
              className="cursor-pointer bg-gray-100 hover:bg-blue-100 px-4 py-2 rounded-lg shadow transition"
            >
              <span className="font-medium">{contact.name}</span>
              <span className="block text-sm text-gray-600">{contact.email}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ContactList;
