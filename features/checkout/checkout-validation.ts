export type FormValues = {
  name: string;
  email: string;
  city: string;
  address: string;
  startDate: string;
};

export type FormErrors = Partial<Record<keyof FormValues, string>>;

export const initialForm: FormValues = {
  name: "",
  email: "",
  city: "",
  address: "",
  startDate: "",
};

export function validateDeliveryForm(form: FormValues): FormErrors {
  const errors: FormErrors = {};

  if (!form.name.trim()) errors.name = "Tell us who to deliver to.";
  if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email)) {
    errors.email = "Enter a valid email address.";
  }
  if (!form.city.trim()) errors.city = "Add your city.";
  if (!form.address.trim()) errors.address = "Add a delivery address.";
  if (!form.startDate) errors.startDate = "Choose a start date.";

  return errors;
}

export function formatDate(value: string) {
  if (!value) return "Soon";
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(`${value}T12:00:00`));
}
