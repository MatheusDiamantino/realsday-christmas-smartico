export function handleProtectedAction(deepLink, fallbackLoginUrl) {
    var login = fallbackLoginUrl || '/login'
    var smartico = window?._smartico
    if (smartico && typeof smartico.getPublicProps === 'function') {
        smartico.getPublicProps(function (props) {
            var isLogged = props && props.player_id && props.player_id !== ''
            if (isLogged) {
                if (typeof smartico.dp === 'function') {
                    smartico.dp(deepLink)
                }
            } else {
                window.location.href = login
            }
        })
    } else {
        window.location.href = login
    }
}
