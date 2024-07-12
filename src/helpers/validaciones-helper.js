class ValidacionesHelper {
    getIntegerOrDefault = (value, defaultValue) => {
        const intValue = parseInt(value);
        return isNaN(intValue) ? defaultValue : intValue;
    };
    getStringOrDefault = (value, defaultValue) => {
        return value !== undefined && value !== null ? value : defaultValue
    };
    getDateOrDefault=(value, defaultValue) => {
        return value !== undefined && value !== null ? value : defaultValue
    };
    getFloatOrDefault = (value, defaultValue) => {
        const floatValue = parseFloat(value);
        return isNaN(floatValue) ? defaultValue : floatValue;
      };
}
export default new ValidacionesHelper();