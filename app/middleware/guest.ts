export default defineNuxtRouteMiddleware((to, from) => {
  console.log('🔑 Middleware guest executado')
  console.log('  📍 De:', from?.path || 'inicial')
  console.log('  📍 Para:', to.path)
  
  if (process.client) {
    const { user } = useAuth()
    
    console.log('👤 Estado do usuário no guest middleware:', user.value ? 'Logado' : 'Não logado')
    
    if (user.value) {
      console.log('✅ Usuário já logado - redirecionando para home')
      return navigateTo('/')
    }
    
    console.log('🔓 Usuário não logado - permitindo acesso a:', to.path)
  }
})