import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { GraduationCap, Loader2, User, Lock, EyeOff, Eye, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useLogin } from '@/hooks/index'
import { setTokens } from '@/lib/auth'
import type { LoginResponse } from '@/types/type'
import { toast } from '@/lib/toast'
import axios from 'axios'

interface LoginFormData {
  email: string
  password: string
  rememberMe: boolean
}

export default function LoginPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [showPassword, setShowPassword] = useState(false)
  const sessionExpired = searchParams.get('session_expired') === 'true'

  const {
    register,
    handleSubmit,
    watch,
    getValues,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<LoginFormData>({
    mode: 'onSubmit',
    defaultValues: { email: '', password: '', rememberMe: true },
  })

  const {
    data: response,
    mutate,
    error: loginError,
    isPending: loginPending,
    reset: resetMutation,
  } = useLogin()

  /* ================= SUCCESS LOGIN ================= */
  useEffect(() => {
    if (!response) return

    // Cast to the shared LoginResponse type (covers flat + wrapped responses)
    const loginResponse = response as LoginResponse

    // Handle both wrapped { data: { ... } } and flat responses
    const authData = loginResponse.data ?? loginResponse

    // Support multiple naming conventions for tokens
    const token = authData.token ?? authData.accessToken ?? authData.access_token
    // Some environments still return only an access token. Use it as a
    // session fallback so protected routes and E2E auth flows remain stable.
    const refresh_token = authData.refresh_token ?? authData.refreshToken ?? token
    const role = authData.role ?? authData.user?.role
    const isTemp = authData.is_temp ?? authData.user?.is_temp

    if (token && refresh_token) {
      // Read the checkbox value at execution time; avoids stale-closure via getValues
      setTokens(token, refresh_token, getValues('rememberMe'))
      console.log('Tokens stored successfully')
    } else {
      console.error('Login success but tokens missing in response:', response)
    }

    if (isTemp) {
      navigate('/reset-password', { replace: true })
      return
    }

    if (role === 'admin') {
      navigate('/admin/homepage', { replace: true })
    } else if (role === 'researcher') {
      navigate('/researcher/homepage', { replace: true })
    } else {
      console.warn('User role missing or unrecognized:', role)
      if (token) {
        navigate('/profile', { replace: true })
      } else {
        navigate('/login', { replace: true })
      }
    }
  }, [response, navigate, getValues])

  /* ================= LOGIN ERROR ================= */
  useEffect(() => {
    if (!loginError) return

    if (!navigator.onLine) {
      toast.error(t('common.internetError'))
      return
    }

    if (
      axios.isAxiosError(loginError) &&
      (!loginError.response ||
        loginError.code === 'ERR_NETWORK' ||
        loginError.response.status === 404 ||
        loginError.response.status >= 500)
    ) {
      toast.error(t('common.serverConnectionError'))
      return
    }

    setError('root', {
      type: 'manual',
      message: t('auth.loginError'),
    })
  }, [loginError, setError, t])

  /* ================= CLEAR ERROR WHEN TYPING ================= */
  useEffect(() => {
    const subscription = watch(() => {
      if (errors.root) clearErrors('root')
    })

    return () => subscription.unsubscribe()
  }, [watch, clearErrors, errors.root])

  /* ================= SUBMIT ================= */
  const onSubmit = (data: LoginFormData) => {
    if (!navigator.onLine) {
      toast.error(t('common.internetError'))
      return
    }

    if (loginPending || isSubmitting) return

    clearErrors('root')
    resetMutation()

    mutate({
      email: data.email.trim(),
      password: data.password,
    })
  }

  const isLoading = loginPending || isSubmitting

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">{t('auth.appTitle')}</h1>
          <p className="text-xl text-muted-foreground">{t('auth.appSubtitle')}</p>
        </div>

        <Card className="w-full max-w-md shadow-md mx-auto">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <GraduationCap className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-center text-2xl">{t('auth.login')}</CardTitle>
            {sessionExpired && (
              <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-3 text-destructive animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p className="text-sm font-medium">{t('auth.sessionExpired')}</p>
              </div>
            )}
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              {/* EMAIL */}
              <div className="space-y-1">
                <Label>{t('auth.email')}</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="email"
                    data-testid="email"
                    placeholder="example@email.com"
                    autoComplete="email"
                    disabled={isLoading}
                    {...register('email', {
                      required: t('auth.emailRequired'),
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: t('auth.emailInvalid'),
                      },
                    })}
                    className={`pl-10 ${errors.email || errors.root ? 'border-destructive' : ''}`}
                  />
                </div>
                {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
              </div>

              {/* PASSWORD */}
              <div className="space-y-2">
                <Label>{t('auth.password')}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    data-testid="password"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    disabled={isLoading}
                    {...register('password', {
                      required: t('auth.passwordRequired'),
                      minLength: {
                        value: 6,
                        message: t('auth.passwordMin6'),
                      },
                    })}
                    className={`pl-10 pr-10 ${
                      errors.password || errors.root ? 'border-destructive' : ''
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground"
                    aria-label={showPassword ? t('auth.hidePassword') : t('auth.showPassword')}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password.message}</p>
                )}

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="rememberMe"
                      checked={watch('rememberMe')}
                      onCheckedChange={(checked) => setValue('rememberMe', !!checked)}
                    />
                    <label
                      htmlFor="rememberMe"
                      className="text-sm font-medium leading-none cursor-pointer select-none"
                    >
                      {t('common.rememberMe') || 'Remember me'}
                    </label>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate('/forget-password')}
                    className="text-sm text-primary hover:underline"
                  >
                    {t('auth.forgotPassword')}
                  </button>
                </div>
              </div>

              {/* ROOT ERROR */}
              {errors.root && (
                <p className="text-sm text-destructive text-center">{errors.root.message}</p>
              )}

              {/* BUTTON */}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {t('auth.loggingIn')}
                  </>
                ) : (
                  t('auth.login')
                )}
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                {t('auth.noAccount')}{' '}
                <button
                  type="button"
                  onClick={() => navigate('/signup')}
                  className="text-primary hover:underline font-medium"
                >
                  {t('auth.signup')}
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
