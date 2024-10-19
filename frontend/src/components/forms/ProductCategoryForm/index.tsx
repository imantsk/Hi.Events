import {UseFormReturnType} from "@mantine/form";
import {ProductCategory} from "../../../types.ts";
import {Switch, TextInput} from "@mantine/core";
import {Editor} from "../../common/Editor";

interface ProductCategoryFormProps {
    form: UseFormReturnType<ProductCategory>,
}

export const ProductCategoryForm = ({form}: ProductCategoryFormProps) => {
    return (
        <>
            <TextInput
                label={"Name"}
                placeholder={"Name"}
                description={"This is the name of the category that will be displayed on the event page."}
                required
                {...form.getInputProps("name")}
            />

            <Editor
                label={"Description"}
                description={"An optional description of this category to display on the event page."}
                onChange={(value) => form.setFieldValue("description", value)}
                value={form.values.description || ""}
            />

            <Switch
                label={"Hide this category?"}
                description={"If checked, this category will be hidden from the public."}
                {...form.getInputProps("is_hidden", {type: "checkbox"})}
            />
        </>
    );
}
