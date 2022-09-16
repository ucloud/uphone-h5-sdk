import router from '../router'

export default {
    navigateTo: ({ url, params }) => {
        if (params) {
            router.push({
                name: url,
                params: params
            })
        } else {
            router.push({
                name: url
            })
        }
    },

}