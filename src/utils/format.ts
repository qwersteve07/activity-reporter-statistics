export const formatMobile = (mobile: string) => {
	return mobile.replaceAll("-", "").padStart(10, "0");
};