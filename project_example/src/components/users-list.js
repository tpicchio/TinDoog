"use client";

import { createUser } from "@/lib/actions";

export function UsersList({ users }) {
  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.email}>
              <td>{user.name}</td>
              <td>{user.email}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <form action={createUser} className="flex gap-4">
        <input
          type="email"
          placeholder="Email"
          name="email"
          className="border"
        />
        <input placeholder="Nome" name="name" className="border" />

        <button type="submit">Crea utente</button>
      </form>
    </div>
  );
}
