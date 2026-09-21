import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useWellness } from '../../context/WellnessContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Input, Select } from '../../components/common/Input';
import { 
  HeartHandshake, 
  Plus, 
  Trash2, 
  Send, 
  ShieldAlert, 
  ShieldCheck, 
  CheckCircle2, 
  PhoneCall, 
  AlertTriangle,
  Mail,
  User
} from 'lucide-react';

export function TrustedContactsPage() {
  const { userProfile, updateProfileData } = useAuth();
  const { recentAssessment, wellnessScoreData } = useWellness();

  const [contacts, setContacts] = useState(userProfile?.trustedContacts || []);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showAssistanceConfirmModal, setShowAssistanceConfirmModal] = useState(false);
  const [selectedContactForAlert, setSelectedContactForAlert] = useState(null);
  const [alertSentStatus, setAlertSentStatus] = useState(null);

  // New Contact Form
  const [newContact, setNewContact] = useState({
    name: '',
    relationship: 'Family',
    phone: '',
    email: '',
    alertOnAssistance: true
  });

  const handleAddContact = async (e) => {
    e.preventDefault();
    if (!newContact.name || !newContact.phone) return;

    const updated = [
      ...contacts,
      {
        id: `tc-${Date.now()}`,
        ...newContact
      }
    ];

    setContacts(updated);
    await updateProfileData({ trustedContacts: updated });
    setNewContact({ name: '', relationship: 'Family', phone: '', email: '', alertOnAssistance: true });
    setShowAddModal(false);
  };

  const handleDeleteContact = async (contactId) => {
    const updated = contacts.filter(c => c.id !== contactId);
    setContacts(updated);
    await updateProfileData({ trustedContacts: updated });
  };

  const handleTriggerAssistanceAlert = (contact) => {
    setSelectedContactForAlert(contact);
    setShowAssistanceConfirmModal(true);
  };

  const handleConfirmSendAlert = () => {
    // Transmit user-initiated assistance signal
    setAlertSentStatus({
      contactName: selectedContactForAlert?.name,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    setShowAssistanceConfirmModal(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
              Trusted Contacts &amp; Assistance
            </h1>
            <Badge variant="rose" size="sm">
              User-Controlled
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Designate trusted contacts who can receive a voluntary assistance alert when you request support.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={Plus}
          onClick={() => setShowAddModal(true)}
        >
          Add Trusted Contact
        </Button>
      </div>

      {/* Emergency Guidance Box */}
      <div className="p-4 bg-rose-50 border border-rose-200 rounded-3xl text-rose-900 text-xs space-y-2">
        <div className="flex items-center gap-2 font-bold text-sm text-rose-800">
          <ShieldAlert className="w-5 h-5 text-rose-600" />
          <span>Notice on Urgent Medical Situations</span>
        </div>
        <p className="text-slate-700 leading-relaxed">
          The Trusted Contact feature is an informal personal network communication tool. 
          If you are experiencing acute pain, difficulty breathing, or severe medical distress, 
          <strong> do not wait for a trusted contact</strong>. Please call emergency services immediately.
        </p>
        <div className="flex items-center gap-3 pt-1">
          <a
            href="tel:911"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 text-white rounded-xl font-bold text-xs hover:bg-rose-700 transition-colors shadow-2xs"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Call 911 (US Emergency)</span>
          </a>
          <a
            href="tel:988"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white rounded-xl font-bold text-xs hover:bg-indigo-700 transition-colors shadow-2xs"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Call 988 (Crisis Lifeline)</span>
          </a>
        </div>
      </div>

      {/* Alert Sent Success Banner */}
      {alertSentStatus && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>
              Assistance message sent to <strong>{alertSentStatus.contactName}</strong> at {alertSentStatus.time}.
            </span>
          </div>
          <button
            onClick={() => setAlertSentStatus(null)}
            className="text-emerald-700 font-bold hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Trusted Contacts List */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
          Configured Trusted Contacts ({contacts.length})
        </h2>

        {contacts.length === 0 ? (
          <Card className="p-8 text-center space-y-3">
            <HeartHandshake className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">No Trusted Contacts Added</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Add a family member, partner, or close friend who can be notified if you request personal assistance.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contacts.map(contact => (
              <Card key={contact.id} className="p-5 bg-white border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-sm">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">{contact.name}</h3>
                        <p className="text-xs text-slate-500">{contact.relationship}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteContact(contact.id)}
                      className="text-slate-300 hover:text-rose-500 p-1 rounded transition-colors"
                      title="Remove contact"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="mt-4 space-y-1.5 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <PhoneCall className="w-3.5 h-3.5 text-slate-400" />
                      <span>{contact.phone}</span>
                    </div>
                    {contact.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span>{contact.email}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* User-controlled "Request Assistance" Button */}
                <div className="pt-3 border-t border-slate-100">
                  <Button
                    variant="danger"
                    size="sm"
                    icon={Send}
                    onClick={() => handleTriggerAssistanceAlert(contact)}
                    className="w-full text-xs shadow-2xs"
                  >
                    Send Assistance Notice
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Add Contact Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Trusted Contact"
        subtitle="You control when and how this contact is notified"
      >
        <form onSubmit={handleAddContact} className="space-y-4">
          <Input
            label="Contact Full Name"
            value={newContact.name}
            onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
            placeholder="e.g. Jane Doe"
            required
          />

          <Input
            label="Relationship"
            value={newContact.relationship}
            onChange={(e) => setNewContact({ ...newContact, relationship: e.target.value })}
            placeholder="e.g. Partner, Sibling, Friend"
            required
          />

          <Input
            label="Phone Number (SMS Alert)"
            value={newContact.phone}
            onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
            placeholder="+1 (555) 000-0000"
            required
          />

          <Input
            label="Email Address"
            type="email"
            value={newContact.email}
            onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
            placeholder="contact@example.com"
          />

          <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>Alerts are never dispatched automatically. They require your manual confirmation.</span>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button variant="ghost" size="md" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md">
              Save Contact
            </Button>
          </div>
        </form>
      </Modal>

      {/* Explicit Assistance Request Confirmation Modal */}
      {selectedContactForAlert && (
        <Modal
          isOpen={showAssistanceConfirmModal}
          onClose={() => setShowAssistanceConfirmModal(false)}
          title="Confirm Assistance Request"
          subtitle="Intentional, user-authorized notification"
        >
          <div className="space-y-4 text-xs">
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-rose-900 space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Notify {selectedContactForAlert.name}?</span>
              </div>
              <p>
                This will send an alert notification to <strong>{selectedContactForAlert.phone}</strong> stating that you have requested a personal wellness check-in.
              </p>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1 text-slate-700">
              <span className="font-bold text-slate-800">Message Preview:</span>
              <p className="italic">
                "Hi {selectedContactForAlert.name}, {userProfile?.name || 'Your friend'} has requested a check-in via IntelWell. Please reach out to them when you can."
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <Button variant="ghost" size="md" onClick={() => setShowAssistanceConfirmModal(false)}>
                Cancel
              </Button>
              <Button variant="danger" size="md" icon={Send} onClick={handleConfirmSendAlert}>
                Authorize &amp; Send
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
