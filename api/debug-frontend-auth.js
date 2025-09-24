import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://amcegyadzphuvqtlseuf.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtY2VneWFkenBodXZxdGxzZXVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1OTY4MTAsImV4cCI6MjA3NDE3MjgxMH0.geKae1U4qgI3JmJUPNQ5p7uho_dDy3NHC-0nEFJlP00'
const supabase = createClient(supabaseUrl, supabaseKey)

const JWT_SECRET = process.env.JWT_SECRET || 'looklyy-super-secret-jwt-key-2024-production-ready'

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  const debugInfo = {
    timestamp: new Date().toISOString(),
    method: req.method,
    headers: req.headers,
    body: req.body,
    tests: []
  }

  try {
    // Test 1: Check if this endpoint is reachable
    debugInfo.tests.push({
      test: 'Endpoint Reachability',
      status: 'success',
      message: 'Debug endpoint is reachable'
    })

    // Test 2: Check Supabase connection
    const { data: connectionTest, error: connectionError } = await supabase
      .from('users')
      .select('count')
      .limit(1)

    if (connectionError) {
      debugInfo.tests.push({
        test: 'Supabase Connection',
        status: 'error',
        message: connectionError.message,
        code: connectionError.code
      })
    } else {
      debugInfo.tests.push({
        test: 'Supabase Connection',
        status: 'success',
        message: 'Supabase connection working'
      })
    }

    // Test 3: If POST request, test signup flow
    if (req.method === 'POST' && req.body) {
      const { name, email, password, testType } = req.body

      if (testType === 'signup' && name && email && password) {
        // Test signup flow
        const salt = await bcrypt.genSalt(12)
        const hashedPassword = await bcrypt.hash(password, salt)

        const { data: newUser, error: signupError } = await supabase
          .from('users')
          .insert([{ name, email, password: hashedPassword }])
          .select()

        if (signupError) {
          debugInfo.tests.push({
            test: 'Signup Flow',
            status: 'error',
            message: signupError.message,
            code: signupError.code,
            details: signupError.details
          })
        } else {
          debugInfo.tests.push({
            test: 'Signup Flow',
            status: 'success',
            message: 'Signup successful',
            user: newUser
          })
        }
      }

      if (testType === 'login' && email && password) {
        // Test login flow
        const { data: user, error: loginError } = await supabase
          .from('users')
          .select('*')
          .eq('email', email)
          .single()

        if (loginError) {
          debugInfo.tests.push({
            test: 'Login Flow - User Lookup',
            status: 'error',
            message: loginError.message,
            code: loginError.code
          })
        } else if (!user) {
          debugInfo.tests.push({
            test: 'Login Flow - User Lookup',
            status: 'error',
            message: 'User not found'
          })
        } else {
          const isMatch = await bcrypt.compare(password, user.password)
          if (isMatch) {
            debugInfo.tests.push({
              test: 'Login Flow - Password Check',
              status: 'success',
              message: 'Password matches',
              user: { id: user.id, email: user.email, name: user.name }
            })
          } else {
            debugInfo.tests.push({
              test: 'Login Flow - Password Check',
              status: 'error',
              message: 'Password does not match'
            })
          }
        }
      }
    }

    res.status(200).json({
      success: true,
      debug: debugInfo
    })

  } catch (error) {
    debugInfo.tests.push({
      test: 'General Error',
      status: 'error',
      message: error.message,
      stack: error.stack
    })

    res.status(500).json({
      success: false,
      debug: debugInfo
    })
  }
}
