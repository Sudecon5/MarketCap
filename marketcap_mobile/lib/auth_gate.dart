import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'main.dart';
import 'login_screen.dart';
import 'dashboard_screen.dart';

class AuthGate extends StatefulWidget {
  const AuthGate({super.key});

  @override
  State<AuthGate> createState() => _AuthGateState();
}

class _AuthGateState extends State<AuthGate> {
  Session? _session = supabase.auth.currentSession;

  @override
  void initState() {
    super.initState();
    // Fires on sign-in, sign-out, and token refresh — keeps this in sync app-wide.
    supabase.auth.onAuthStateChange.listen((data) {
      setState(() => _session = data.session);
    });
  }

  @override
  Widget build(BuildContext context) {
    return _session != null ? const DashboardScreen() : const LoginScreen();
  }
}