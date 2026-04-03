import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'home_screen.dart';

// ─────────────────────────────────────────────────────────────────────────────
// ONBOARDING SCREEN
// Three pages shown only on the very first launch.
// When the user taps "Get Started", we mark the flag in SharedPreferences
// so the onboarding is never shown again.
// ─────────────────────────────────────────────────────────────────────────────

// Data for one onboarding page
class _OnboardingPage {
  final IconData icon;
  final String title;
  final String subtitle;
  final MaterialColor color;

  const _OnboardingPage({
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.color,
  });
}

// The three pages
const _pages = [
  _OnboardingPage(
    icon: Icons.account_balance_wallet_rounded,
    title: 'Track Your Spending',
    subtitle:
        'Log every income and expense in seconds. Know exactly where your money goes.',
    color: Colors.deepPurple,
  ),
  _OnboardingPage(
    icon: Icons.category_rounded,
    title: 'Organize by Category',
    subtitle:
        'From food to transport, tag each transaction so you can spot your spending habits.',
    color: Colors.teal,
  ),
  _OnboardingPage(
    icon: Icons.insights_rounded,
    title: 'See the Big Picture',
    subtitle:
        'Your balance, income, and expenses update instantly. All data stays on your device.',
    color: Colors.orange,
  ),
];

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  final PageController _pageController = PageController();
  int _currentPage = 0;

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  // Advance to the next page, or finish onboarding on the last page
  void _next() {
    if (_currentPage < _pages.length - 1) {
      _pageController.nextPage(
        duration: const Duration(milliseconds: 350),
        curve: Curves.easeInOut,
      );
    } else {
      _finish();
    }
  }

  // Mark onboarding as done and navigate to HomeScreen
  Future<void> _finish() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool('onboarding_done', true);

    if (!mounted) return;
    // Replace the onboarding with the home screen — no back button
    Navigator.of(context).pushReplacement(
      MaterialPageRoute(builder: (_) => const HomeScreen()),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Column(
          children: [
            // ── Page content ─────────────────────────────────────────────
            Expanded(
              child: PageView.builder(
                controller: _pageController,
                itemCount: _pages.length,
                onPageChanged: (index) =>
                    setState(() => _currentPage = index),
                itemBuilder: (_, index) =>
                    _OnboardingPageView(page: _pages[index]),
              ),
            ),

            // ── Bottom controls ───────────────────────────────────────────
            Padding(
              padding: const EdgeInsets.fromLTRB(24, 8, 24, 32),
              child: Column(
                children: [
                  // Dot indicators
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: List.generate(
                      _pages.length,
                      (i) => _DotIndicator(
                        isActive: i == _currentPage,
                        color: _pages[_currentPage].color,
                      ),
                    ),
                  ),
                  const SizedBox(height: 24),

                  // Next / Get Started button
                  SizedBox(
                    width: double.infinity,
                    child: FilledButton(
                      onPressed: _next,
                      style: FilledButton.styleFrom(
                        backgroundColor: _pages[_currentPage].color,
                        padding:
                            const EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(14),
                        ),
                      ),
                      child: Text(
                        _currentPage == _pages.length - 1
                            ? 'Get Started'
                            : 'Next',
                        style: const TextStyle(fontSize: 16),
                      ),
                    ),
                  ),

                  // Skip link (only on pages 1 & 2)
                  if (_currentPage < _pages.length - 1)
                    TextButton(
                      onPressed: _finish,
                      child: const Text('Skip'),
                    ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ── Single onboarding page content ───────────────────────────────────────────
class _OnboardingPageView extends StatelessWidget {
  final _OnboardingPage page;

  const _OnboardingPageView({required this.page});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 32),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          // Large icon inside a tinted circle
          Container(
            width: 140,
            height: 140,
            decoration: BoxDecoration(
              color: page.color.shade500.withValues(alpha: 0.12),
              shape: BoxShape.circle,
            ),
            child: Icon(
              page.icon,
              size: 72,
              color: page.color,
            ),
          ),
          const SizedBox(height: 40),

          // Title
          Text(
            page.title,
            textAlign: TextAlign.center,
            style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
          ),
          const SizedBox(height: 16),

          // Subtitle
          Text(
            page.subtitle,
            textAlign: TextAlign.center,
            style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                  color: Theme.of(context)
                      .colorScheme
                      .onSurface
                      .withValues(alpha: 0.6),
                  height: 1.5,
                ),
          ),
        ],
      ),
    );
  }
}

// ── Animated dot indicator ────────────────────────────────────────────────────
class _DotIndicator extends StatelessWidget {
  final bool isActive;
  final MaterialColor color;

  const _DotIndicator({required this.isActive, required this.color});

  @override
  Widget build(BuildContext context) {
    return AnimatedContainer(
      duration: const Duration(milliseconds: 250),
      margin: const EdgeInsets.symmetric(horizontal: 4),
      width: isActive ? 24 : 8,
      height: 8,
      decoration: BoxDecoration(
        color: isActive ? color : color.shade300,
        borderRadius: BorderRadius.circular(4),
      ),
    );
  }
}
