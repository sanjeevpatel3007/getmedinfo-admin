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
        // Update the contacts list with the updated contact
        setContacts(contacts.map(contact => 
          contact.id === id ? { ...contact, status: newStatus } : contact
        ));
        // If the contact is currently selected in the modal, update it there too
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
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Contact Management</h2>
      <p className="text-gray-700 mb-4">
        Manage all contact inquiries and messages from users of the GetMedInfo platform.
      </p>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="mt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Contact Inquiries</h3>
          <button 
            onClick={fetchContacts}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
          >
            Refresh
          </button>
        </div>
        
        {loading ? (
          <div className="text-center py-4">Loading contacts...</div>
        ) : contacts.length === 0 ? (
          <div className="text-center py-4">No contacts found</div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subject
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {contacts.map((contact) => (
                  <tr key={contact.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{contact.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{contact.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{contact.subject}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(contact.created_at)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button 
                        onClick={() => handleStatusToggle(contact.id, contact.status)}
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${contact.status === 'resolved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
                      >
                        {contact.status === 'resolved' ? 'Resolved' : 'Pending'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        onClick={() => handleViewContact(contact)}
                        className="text-indigo-600 hover:text-indigo-900"
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
      </div>

      {/* Modal for viewing contact details */}
      {showModal && selectedContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold">Contact Details</h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Name</p>
                <p className="text-base">{selectedContact.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="text-base">{selectedContact.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Date</p>
                <p className="text-base">{formatDate(selectedContact.created_at)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Status</p>
                <div className="flex items-center">
                  <span 
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${selectedContact.status === 'resolved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'} mr-2`}
                  >
                    {selectedContact.status === 'resolved' ? 'Resolved' : 'Pending'}
                  </span>
                  <button 
                    onClick={() => handleStatusToggle(selectedContact.id, selectedContact.status)}
                    className="text-sm text-indigo-600 hover:text-indigo-900"
                  >
                    Toggle Status
                  </button>
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-500">Subject</p>
              <p className="text-base">{selectedContact.subject}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500">Message</p>
              <div className="mt-1 p-4 bg-gray-50 rounded-lg">
                <p className="text-base whitespace-pre-wrap">{selectedContact.message}</p>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button 
                onClick={() => setShowModal(false)}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-300"
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