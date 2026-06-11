type CrispCommand = unknown[];

declare global {
  interface Window {
    $crisp?: CrispCommand[];
  }
}

function crispPush(command: CrispCommand) {
  window.$crisp = window.$crisp || [];
  window.$crisp.push(command);
}

export function configureCrispCustomLauncher() {
  crispPush(["config", "color:theme", ["#6B7280"]]);
  crispPush(["do", "chat:hide"]);
  crispPush([
    "on",
    "chat:closed",
    function onCrispClosed() {
      crispPush(["do", "chat:hide"]);
    },
  ]);
}

export function openCrispChat() {
  crispPush(["do", "chat:show"]);
  crispPush(["do", "chat:open"]);
}

export function hideCrispChat() {
  crispPush(["do", "chat:hide"]);
}
