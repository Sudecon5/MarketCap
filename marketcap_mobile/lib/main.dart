import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'secure_storage.dart';
import 'auth_gate.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  await Supabase.initialize(
    url: const String.fromEnvironment('SUPABASE_URL'),
    publishableKey: const String.fromEnvironment('SUPABASE_PUBLISHABLE_KEY'),
    authOptions: FlutterAuthClientOptions(
      // Swap the default SharedPreferences storage for the OS keychain/keystore
      localStorage: SecureLocalStorage(),
    ),
  );

  runApp(const MarketCapApp());
}

final supabase = Supabase.instance.client;

class MarketCapApp extends StatelessWidget {
  const MarketCapApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'MarketCap',
      debugShowCheckedModeBanner: false,
      home: const AuthGate(),
    );
  }
}