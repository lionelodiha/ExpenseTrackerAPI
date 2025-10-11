import { ExpenseTrackerApiRoutes } from "../constants/expense-tracker-api-routes";
import type { ApiResponse } from "../dtos/api-response";
import { unwrapApiResponse } from "../utils/api-response";
import { expenseTrackerApiClient } from "./expense-tracker-api-client";

export interface UserProfileData {
	id?: string;
	name: string;
	nickname: string;
	email: string;
	profilePicture: string;
	phone?: string;
	bio?: string;
	createdAt?: string;
}

export interface UpdateProfileRequest {
	name: string;
	nickname: string;
	profilePicture: string;
	phone?: string;
	bio?: string;
}

export const userService = {
	async getProfile(): Promise<ApiResponse<UserProfileData>> {
		const response = await expenseTrackerApiClient
			.get<ApiResponse<UserProfileData>>(ExpenseTrackerApiRoutes.user.get.profile);

		return unwrapApiResponse(response);
	},

	async updateProfile(payload: UpdateProfileRequest): Promise<ApiResponse<UserProfileData>> {
		const response = await expenseTrackerApiClient
			.put<ApiResponse<UserProfileData>>(ExpenseTrackerApiRoutes.user.put.profile, payload);

		return unwrapApiResponse(response);
	},
};
