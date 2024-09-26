export const API_URL = 'http://localhost:5180/api';

export const getBannerEndpoint = () => `${API_URL}/Banner`;
export const getBlogsEndpoint = () => `${API_URL}/Blog/all?count=3`;
export const getGroupsHomeEndpoint = () => `${API_URL}/Group?count=3`;
export const getTeachersHomeEndpoint = () => `${API_URL}/Teacher/all?count=3`;
export const getLogoEndpoint = () => `${API_URL}/Settings/key/logo`;
export const getSettingsEndpoint = () => `${API_URL}/Settings`;
export const getBlogsSearch = (search = '', page = 1) => `${API_URL}/Blog/all?text=${search}&page=${page}`;
export const getTeachersSearch = (search = '', page = 1) => `${API_URL}/Teacher/all?text=${search}&page=${page}`;


