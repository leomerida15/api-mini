export const getFormData = (formData: { append: (arg0: string, arg1: any) => void; }, data: any, previousKey: any) => {
    if (data instanceof Object) {
        Object.keys(data).forEach((key: any) => {
            const value = data[key];
            if (value instanceof Object && !Array.isArray(value)) {
                return getFormData(formData, value, key);
            }
            if (previousKey) {
                key = `${previousKey}[${key}]`;
            }
            if (Array.isArray(value)) {
                value.forEach(val => {
                    formData.append(`${key}[]`, val);
                });
            } else {
                formData.append(key, value);
            }
        });
    }
}