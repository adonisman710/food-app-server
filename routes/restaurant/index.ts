import { Router } from "express";
import {
  createRestaurant,
  deleteRestaurant,
  getAllRestaurants,
  getRestaurant,
  updateRestaurant,
} from "../../controllers/restaurants";
import { adminRole, isAuthenticated } from "../../middleware/auth";
import { createValidator } from "express-joi-validation";
import Joi from "joi";

const router = Router();
const validator = createValidator({});

const restaurantSchema = Joi.object({
  name: Joi.string().min(20).max(100).required(),
  short_description: Joi.string().min(50).max(250).required(),
  image: Joi.string().required(),
  lat: Joi.number().required(),
  long: Joi.number().required(),
  address: Joi.string().min(5).required(),
  rating: Joi.number().required(),
  categories: Joi.array(),
  dishes: Joi.array(),
});

router.post(
  "/create",
  validator.body(restaurantSchema),
  isAuthenticated,
  adminRole("admin"),
  createRestaurant
);
router.get("/restaurant", isAuthenticated, getAllRestaurants);
router.get("/restaurant/:id", isAuthenticated, getRestaurant);
router.put("/restaurant/:id", isAuthenticated, updateRestaurant);
router.delete("/restaurant/:id", isAuthenticated, deleteRestaurant);

export default router;
