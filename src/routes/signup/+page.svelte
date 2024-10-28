<script lang="ts">
    import { goto } from "$app/navigation";
    import { PUBLIC_API_SERVER } from "$env/static/public";
    import { Button } from "$lib/components/ui/button/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import { Label } from "$lib/components/ui/label/index.js";
    import axios, { AxiosError } from "axios";
    import { toast } from "svelte-sonner";

    let email:string
    let password:string
    let showPassoword = false
    let loading = false
    
    async function signup() {
      if(!email) return toast("Email is empty")
      if(!password) return toast("Password is empty")

      loading = true
       try {
        var res = await axios.post(`${PUBLIC_API_SERVER}/public/user/signup`,{
          email,
          password
        })

        if(res.status == 200){
          
          loading = false
          goto("/login")

        }else{
          toast.error("Invaild Signup")
        }
       } catch (error) {
        if(error instanceof AxiosError){
          toast.error(error.response?.data || "Invaild Signup")
        }else{
          toast.error("Invaild Signup")
        }
       }finally{
        loading = false
       }

      
      
      
    }
    
    
</script>
<section class="h-full flex justify-center items-center">
  <div class="w-[90vw] h-[90vh] lg:grid lg:grid-cols-2 bg-white border rounded overflow-hidden">
    <div class="flex items-center justify-center py-12">
      <div class="mx-auto grid w-[350px] md:w-fit gap-6">
        <div class="grid gap-2 text-center">
          <h1 class="text-3xl md:text-4xl font-bold text-black text-opacity-90 mb-8">Waste Watch Wizard</h1>
          <h1 class="text-3xl font-bold text-black text-opacity-70">Signup</h1>
          <p class="text-muted-foreground text-balance">
            Enter your email and passowrd below to singup for a free account
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
          <Button on:click={signup} disabled={loading} type="button" class="w-full">Signup</Button>
          <a href="/login">
            <Button variant="outline" class="w-full">Login</Button>
          </a>
        </div>
        <div class="mt-2 text-center text-[0.7rem] w-[500px] text-black text-opacity-70">
          WasteWatchWizard is an integrated waste audit system.
          It is inspired by the amount of waste generated in schools.
          The system enables schools and other institutions to effectively 
          measure and manage the amount of waste generated.
        </div>
        <!-- <div class="mt-4 text-center text-sm">
          Don&apos;t have an account?
          <a href="##" class="underline"> Sign up </a>
        </div> -->
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
  