<script context="module" lang="ts">
    // GET COOKIE
    export function getCookie(name:string) {
        try {
            let cookieName = name + "=";
            let decodedCookie = decodeURIComponent(document.cookie);
            let ca = decodedCookie.split(';');
            for(let i = 0; i < ca.length; i++) {
                let c = ca[i];
                while (c.charAt(0) == ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(cookieName) == 0) {
                    return c.substring(cookieName.length, c.length);
                }
            }
            return "";
        } catch (error) {
            return "";
        }
    }

    // SET COOKIE
    export function setCookie(name:string, value:any, exdays=1000, secure=false) {
        try {
            const d = new Date();
            d.setTime(d.getTime() + (exdays*24*60*60*1000));
            let expires = "expires="+ d.toUTCString();
            if (secure) {
                document.cookie = name + "=" + value + ";" + expires + ";path=/; secure";
            } else {
                document.cookie = name + "=" + value + ";" + expires + ";path=/";
            }
        } catch (error) {
            
        }
    }

    // DELETE COOKIE
    export function deleteCookie(name:string) {
        try {
            document.cookie = name+'=; Max-Age=-99999999;'; 
        } catch (error) {
            
        }
    }
</script>