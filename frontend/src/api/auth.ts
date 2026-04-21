//TODO: Replace with real API calls when backend is ready
export async function registerWorker(data: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return { success: true };
}

//TODO: Replace with real API calls when backend is ready
export async function registerEmployer(data: {
  restaurantName: string;
  email: string;
  password: string;
}) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return { success: true };
}
