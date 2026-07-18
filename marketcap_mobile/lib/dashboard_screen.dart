import 'package:flutter/material.dart';
import 'main.dart';

class DashboardScreen extends StatelessWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final user = supabase.auth.currentUser;

    return Scaffold(
      backgroundColor: const Color(0xFFF8F9FA), // Light modern background
      appBar: AppBar(
        title: const Text(
          'MarketCap',
          style: TextStyle(fontWeight: FontWeight.bold, color: Colors.black),
        ),
        backgroundColor: Colors.white,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.logout, color: Colors.black),
            onPressed: () => supabase.auth.signOut(),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // User Greeting Header
            Text(
              'Welcome back,',
              style: TextStyle(fontSize: 16, color: Colors.grey[600]),
            ),
            Text(
              '${user?.email?.split('@')[0]}', // Shows just the username before @
              style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 24),

            // Watchlist Section Title
            const Text(
              'Markets Overview',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 12),

            // Sample Interactive Asset Grid Layout
            GridView.count(
              crossAxisCount: 2,
              crossAxisSpacing: 12,
              mainAxisSpacing: 12,
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              children: [
                _buildCryptoCard('BTC / USD', '\$64,250.00', '+2.4%', Colors.green),
                _buildCryptoCard('ETH / USD', '\$3,450.50', '-1.2%', Colors.red),
                _buildCryptoCard('SOL / USD', '\$145.25', '+5.8%', Colors.green),
                _buildCryptoCard('BNB / USD', '\$580.10', '0.0%', Colors.grey),
              ],
            ),
          ],
        ),
      ),
    );
  }

  // Quick helper layout widget to draw asset summary cards
  Widget _buildCryptoCard(String pair, String price, String change, Color changeColor) {
    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      color: Colors.white,
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(pair, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
            const SizedBox(height: 8),
            Text(price, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w500)),
            const SizedBox(height: 4),
            Text(
              change,
              style: TextStyle(color: changeColor, fontWeight: FontWeight.bold, fontSize: 14),
            ),
          ],
        ),
      ),
    );
  }
}