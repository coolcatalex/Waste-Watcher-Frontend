// import userStore from "$lib/stores/userStore";
import { redirect } from "@sveltejs/kit";
const public_paths = [
    '/login',
    '/signin',
    "/cal"
];

function isPathAllowed(path:string) {
    return public_paths.some(allowedPath =>
      path === allowedPath || path.startsWith(allowedPath + '/')
    );
}

// @ts-ignore
export const handle = async ({ event, resolve}) => {
    let user = null
    // check if the cookie exist, and if exists, parse it to the user variable
    if(event.cookies.get('RECYCLE_TOKEN') != undefined && event.cookies.get('RECYCLE_TOKEN') != null){
      user = event.cookies.get('RECYCLE_TOKEN')
    }
    const url = new URL(event.request.url);
    // console.log(user)
    // validate the user existence and if the path is acceesible
    // console.log({
    //   user: !user,
    //   allow: !isPathAllowed(url.pathname)
    // })
    if (!user && !isPathAllowed(url.pathname)) {
      throw redirect(302, '/login');
    }
    
    if(user){
      //set the user to the locals (i explain this later on the article)
      // event.locals.user = user
  
      // redirect user if he is already logged if he try to access signin or signup
    //   if(url.pathname == '/login' || url.pathname == '/login'){
      if(url.pathname == '/login' || url.pathname == "/" || url.pathname == "/auth"){
        throw redirect(302, '/auth/dashboard')
      }
    }
  
    const response = await resolve(event)
  
    return response
}

  
  