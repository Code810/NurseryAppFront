export const API_URL = 'http://localhost:5180/api';

export const getBannerEndpoint = () => `${API_URL}/Banner`;
export const getBlogsEndpoint = () => `${API_URL}/Blog/all?count=3`;
export const getGroupsHomeEndpoint = () => `${API_URL}/Group/all?count=3`;
export const getTeachersHomeEndpoint = () => `${API_URL}/Teacher/all?count=3`;
export const getLogoEndpoint = () => `${API_URL}/Settings/key/logo`;
export const getSettingsEndpoint = () => `${API_URL}/Settings`;
export const getBlogsSearch = (search = '', page = 1) => `${API_URL}/Blog/all?text=${search}&page=${page}`;
export const getTeachersSearch = (search = '', page = 1) => `${API_URL}/Teacher/all?text=${search}&page=${page}`;
export const getRegisterEndpoint = () => `${API_URL}/Auth/register`;
export const getConfirmEndpoint = () => `${API_URL}/Auth/confirm-email`;
export const getLoginEndpoint = () => `${API_URL}/Auth/login`;
export const getForgotPasswordEndpoint = () => `${API_URL}/Auth/forget-password`;
export const getResetPasswordEndoint = (email , token) => `${API_URL}/Auth/reset-password?email=${email}&token=${token}`;
export const getGroupsSearch = (search = '', page = 1) => `${API_URL}/Group/all?text=${search}&page=${page}`;
export const getBlogDetailEndpoint = (id) => `${API_URL}/Blog/${id}`;
export const postCommentEndpoint = () => `${API_URL}/Comment`;
export const deleteCommentEndpoint = (commentId) => `${API_URL}/Comment/${commentId}`;
export const updateCommentEndpoint = (editCommentId) => `${API_URL}/Comment/${editCommentId}`;
export const getTeacherDetailEndpoint = (id) => `${API_URL}/teacher/${id}`;
export const getStudentsEndpoint = (parentId) => `${API_URL}/Student?parentId=${parentId}`;
export const getStudentEndpoint = (studentId) => `${API_URL}/Student/${studentId}`;
export const studentCreateEndpoint = () => `${API_URL}/Student`;
export const studentUpdateEndpoint = (stuid) => `${API_URL}/Student/${stuid}`;
export const getParentEndpoint = (appUserId) => `${API_URL}/Parent/${appUserId}`;
export const getFeesEndpoint = (studentId) => `${API_URL}/Fees/${studentId}`;
export const getGroupsEndpoint = () => `${API_URL}/Group/all`;
export const getFeeEndpoint = () => `${API_URL}/Fee/create-fee`;
export const getPaymentCheachkEndpoint = () => `${API_URL}/Payment/create-payment-intent`;










