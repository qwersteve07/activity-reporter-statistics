export const formatMobile = (mobile: string) => {
	if(!mobile) return ''
	return mobile.replaceAll("-", "").padStart(10, "0");
};