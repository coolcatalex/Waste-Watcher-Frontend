<script lang="ts">
    import { goto } from "$app/navigation";
    import { PUBLIC_API_SERVER } from "$env/static/public";
    import { Button } from "$lib/components/ui/button/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import { Label } from "$lib/components/ui/label/index.js";
    import { setCookie } from "$lib/scripts/Cookie.svelte";
    import selectedOrgStore, { initialSelectedOrgStoreState } from "$lib/stores/selectedOrg";
    import userStore, { type userStoreType } from "$lib/stores/userStore";
    import axios from "axios";
    import { toast } from "svelte-sonner";

    let email:string
    let password:string
    let showPassoword = false
    let loading = false
    
    async function login() {
      if(!email) return toast("Email is empty")
      if(!password) return toast("Password is empty")

      loading = true
       try {
        var res = await axios.post<userStoreType>(`${PUBLIC_API_SERVER}/public/user/login`,{
          email,
          password
        })

        if(res.status == 200){
          var data = res.data
          setCookie("RECYCLE_TOKEN",data.token)
          userStore.set(res.data)
          if(res.data.onBoarding){
            var _data = Object.keys(res.data.onBoarding)
            if(_data.length > 0){
              // @ts-ignore
              selectedOrgStore.set(res.data.onBoarding[_data[0]])
            }else{
              selectedOrgStore.set(initialSelectedOrgStoreState)
            }
          }
          
          loading = false
          goto("/auth/dashboard")

        }else{
          toast.error("Invaild Login")
        }
       } catch (error) {
        toast.error("Invaild Login")
       }finally{
        loading = false
       }

      
      
      
    }
    
    
</script>
<section class="h-full flex justify-center items-center">
  <div class="px-8 w-[90vw] md:h-[90vh] lg:grid lg:grid-cols-2 bg-white border rounded md:overflow-hidden">
    <div class="flex items-center justify-center py-12">
      <div class="mx-auto grid w-[350px] md:w-fit gap-6">
        <div class="grid gap-2 text-center">
          <h1 class="text-3xl md:text-4xl font-bold text-black text-opacity-90 mb-8">Waste Watch Wizard</h1>
          <h1 class="text-3xl font-bold text-black text-opacity-70">Login</h1>
          <p class="text-muted-foreground text-balance">
            Enter your email below to login to your account
          </p>
        </div>
        <div class="grid gap-4">
          <div class="grid gap-2">
            <Label for="email">Email</Label>
            <Input id="email" type="email" placeholder="user@example.com" bind:value={email} required />
          </div>
          <div class="grid gap-2">
            <div class="flex items-center">
              <Label for="password">Password</Label>
              <!-- <a href="##" class="ml-auto inline-block text-sm underline">
                Forgot your password?
              </a> -->
            </div>
            <div class="relative flex justify-center items-center">
              <Input id="password" type={showPassoword ? "text":"password"} placeholder="******" bind:value={password} required />
              {#if showPassoword}
                <button class="absolute right-0 translate-x-[120%]" on:click={()=>{showPassoword = !showPassoword}}>
                  <img alt="showPassoword" src="/images/default/svg/eye-show.svg" class="h-6 w-auto" />
                </button>
              {:else}
                <button class="absolute right-0 translate-x-[120%]" on:click={()=>{showPassoword = !showPassoword}}>
                  <img alt="hidePassoword" src="/images/default/svg/eye-hide.svg" class="h-6 w-auto" />
                </button>
              {/if}
            </div>
          </div>
          <Button on:click={login} disabled={loading} type="button" class="w-full">Login</Button>
          <!-- <Button variant="outline" class="w-full">Login with Google</Button> -->
        </div>
        <div class="mt-4 text-center text-sm">
          Don&apos;t have an account?
          <a href="/signup" class="underline"> Sign up </a>
        </div>
        
        <div class="mt-2 text-center text-[0.7rem] w-fit md:w-[500px] text-black text-opacity-70">
          WasteWatchWizard is an integrated waste audit system.
          It is inspired by the amount of waste generated in schools.
          The system enables schools and other institutions to effectively 
          measure and manage the amount of waste generated.
        </div>
        
      </div>
    </div>
    <div class="bg-muted hidden lg:block">
      <img
        src="/images/default/svg/login_bg.svg"
        alt="Recycle"
        class="h-[90vh] w-full object-cover dark:brightness-[0.2] dark:grayscale"
      />
    </div>
  </div>
</section>
  