import fs from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";

const contactsPath = path.join("__dirname", "../db/contacts.json");

async function listContact() {
    const data = await fs.readFile(contactsPath);
    return JSON.parse(data);
}

async function getContactById(id) {
    const contacts = await listContact();
    const result = contacts.find(contact => contact.id === id);
    return result || null;
}

async function removeContact(id) {
    const contacts = await listContact();
    const index = contacts.findIndex(contact => contact.id === id);
    if (index === -1) {
        return null;
    };
    const [result] = contacts.splice(index, 1);
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return result;
}

async function updateContactById (id, data) {
    const contacts = await listContact();
    const index = contacts.findIndex(contact => contact.id === id);
    if (index === -1) {
        return null;
    };
    contacts[index] = { ...contacts[index], ...data};
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return contacts[index];
}

async function addContact({ name, email, phone }) {
    const contacts = await listContact(); 
    const newContact = {
        id: nanoid(),
        name,
        email,
        phone
    };
    contacts.push(newContact);
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return newContact;
}

export {
    listContact,
    getContactById,
    addContact,
    removeContact,
    updateContactById,
}