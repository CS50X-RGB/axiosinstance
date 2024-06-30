import inquirer from "inquirer";

export async function promptBackendUrl() {
  const ans = await inquirer.prompt([
    {
      type: 'input',
      name: 'backendUrl',
      message: "Enter your Backend Url"
    }
  ])
  return ans.backendUrl;
}
