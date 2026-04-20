import { mockRestaurants } from "../data/mockRestaurants";

//? Change to get by ID?
export async function getRestaurantByName(name: string) {
  const restaurant = mockRestaurants.find(
    (restaurant) => restaurant.name === name,
  );

  if (!restaurant) throw new Error("Ingen restaurang hittades");

  return restaurant;
}
