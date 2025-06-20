'use client';

import { useState, useEffect } from 'react';
import { getContacts, updateContactStatus, Contact } from '@/action/contact.action';

export default function ContactPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const response = await getContacts();
      if (response.error) {
        setError(response.error.message);
      } else {
        setContacts(response.data);
        setError(null);
      }
    } catch (err) {
      setError('Failed to fetch contacts');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = async (id: string, currentStatus: 'pending' | 'resolved') => {
    const newStatus = currentStatus === 'pending' ? 'resolved' : 'pending';
    try {
      const response = await updateContactStatus(id, newStatus);
      if (response.error) {
        setError(response.error.message);
      } else {
        setContacts(contacts.map(contact =>
          contact.id === id ? { ...contact, status: newStatus } : contact
        ));
        if (selectedContact && selectedContact.id === id) {
          setSelectedContact({ ...selectedContact, status: newStatus });
        }
      }
    } catch (err) {
      setError('Failed to update contact status');
    }
  };

  const handleViewContact = (contact: Contact) => {
    setSelectedContact(contact);
    setShowModal(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">Contact Management</h2>
      <p className="text-gray-600 mb-4">
        Manage all contact inquiries and messages from users of the GetMedInfo platform.
      </p>

      {error && (
        <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded mb-4">
          {error}
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Contact Inquiries</h3>
        <button
          onClick={fetchContacts}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 text-sm"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="text-center text-gray-500 py-6">Loading contacts...</div>
      ) : contacts.length === 0 ? (
        <div className="text-center text-gray-500 py-6">No contacts found</div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full text-sm divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                {['Name', 'Email', 'Subject', 'Date', 'Status', 'Actions'].map(header => (
                  <th key={header} className="px-6 py-3 text-left font-medium text-gray-600 uppercase tracking-wider">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {contacts.map(contact => (
                <tr key={contact.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{contact.name}</td>
                  <td className="px-6 py-4 text-gray-700">{contact.email}</td>
                  <td className="px-6 py-4 text-gray-700">{contact.subject}</td>
                  <td className="px-6 py-4 text-gray-700">{formatDate(contact.created_at)}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleStatusToggle(contact.id, contact.status)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition duration-150 ${contact.status === 'resolved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
                    >
                      {contact.status === 'resolved' ? 'Resolved' : 'Pending'}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleViewContact(contact)}
                      className="text-indigo-600 hover:text-indigo-900 text-sm"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && selectedContact && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Contact Details</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                ×
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="text-base font-medium text-gray-900">{selectedContact.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-base font-medium text-gray-900">{selectedContact.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="text-base font-medium text-gray-900">{formatDate(selectedContact.created_at)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${selectedContact.status === 'resolved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {selectedContact.status}
                  </span>
                  <button
                    onClick={() => handleStatusToggle(selectedContact.id, selectedContact.status)}
                    className="text-indigo-600 hover:text-indigo-800 text-sm"
                  >
                    Toggle
                  </button>
                </div>
              </div>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-500">Subject</p>
              <p className="text-base text-gray-900 font-medium">{selectedContact.subject}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Message</p>
              <div className="mt-1 p-4 bg-gray-50 rounded-lg text-gray-800 text-sm whitespace-pre-line">
                {selectedContact.message}
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-sm font-medium text-gray-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
