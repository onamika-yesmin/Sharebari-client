"use client";

type AlertIcon = "success" | "error" | "warning" | "info" | "question";

async function getSwal() {
  const mod = await import("sweetalert2");
  return mod.default;
}

export async function showAlert(title: string, text: string, icon: AlertIcon = "info") {
  const Swal = await getSwal();
  return Swal.fire({
    title,
    text,
    icon,
    confirmButtonText: "OK",
    confirmButtonColor: "#111827",
    background: "#ffffff",
    color: "#18181b",
    customClass: {
      popup: "sharebari-alert",
      confirmButton: "sharebari-alert-button",
    },
  });
}

export async function showSuccess(title: string, text: string) {
  return showAlert(title, text, "success");
}

export async function showError(title: string, text: string) {
  return showAlert(title, text, "error");
}

export async function confirmAction(title: string, text: string, confirmButtonText = "Confirm") {
  const Swal = await getSwal();
  const result = await Swal.fire({
    title,
    text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText: "Cancel",
    confirmButtonColor: "#111827",
    cancelButtonColor: "#71717a",
    reverseButtons: true,
    background: "#ffffff",
    color: "#18181b",
    customClass: {
      popup: "sharebari-alert",
      confirmButton: "sharebari-alert-button",
      cancelButton: "sharebari-alert-cancel",
    },
  });

  return result.isConfirmed;
}
