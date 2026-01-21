import {createApi} from "@reduxjs/toolkit/query/react";
import {createBaseQuery} from "../utils/createBaseQuery.ts";
import type {ICreateCategory} from "../types/category/ICreateCategory.ts";
import {serialize} from "object-to-formdata";
import type {ICategoryItem} from "../types/category/ICategoryItem.ts";

export const categoryService = createApi({
   reducerPath: "categoryService",
   baseQuery: createBaseQuery("categories"),
    tagTypes: ['Categories'],
    endpoints: (builder) => ({
        createCategory: builder.mutation<void, ICreateCategory>({
            query: (requestData) => {
                const formData = serialize(requestData);
                return {
                    url: '/',
                    method: 'POST',
                    body: formData
                }
            }
        }),
        getCategories: builder.query<Array<ICategoryItem>, void>({
            query: ()=> {
                return {
                    url: '/',
                    method: 'GET'
                }
            }
        })
    }),
});

export const { useCreateCategoryMutation, useGetCategoriesQuery } = categoryService;