export function LoginPage(props) {
  const appTitle = props.appTitle;

  const uppercaseTitle = appTitle.toUpperCase();

  return (
    <div className="flex items-center h-full w-full justify-center flex-col gap-4">
      <h1>{uppercaseTitle}</h1>
      <p>Clicca per accedere</p>
      <button className="border p-2">Accedi</button>
      <button className="border p-2">Registrati</button>
    </div>
  );
}
