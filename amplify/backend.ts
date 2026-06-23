import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import { flickrFunction } from "./functions/flickr/resource";
import { storage } from "./storage/resource";

defineBackend({
	auth,
	data,
	storage,
	flickrFunction,
});
