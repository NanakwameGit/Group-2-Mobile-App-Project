import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/transaction.dart';

// ─────────────────────────────────────────────────────────────────────────────
// HOME SCREEN
// ─────────────────────────────────────────────────────────────────────────────
class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  // The key used to store / retrieve transactions in SharedPreferences
  static const _storageKey = 'transactions';

  // The in-memory list — loaded from storage on startup
  final List<Transaction> _transactions = [];

  // Controls whether the spinner is shown while we read from disk
  bool _isLoading = true;

  // ── Lifecycle ──────────────────────────────────────────────────────────────
  @override
  void initState() {
    super.initState();
    _loadTransactions();
  }

  // ── Storage helpers ────────────────────────────────────────────────────────

  // Read the saved JSON from SharedPreferences and rebuild the list.
  // If no data exists yet (very first run), seed with sample transactions
  // so the app looks populated during a demo.
  Future<void> _loadTransactions() async {
    final prefs = await SharedPreferences.getInstance();
    final jsonString = prefs.getString(_storageKey);

    if (jsonString != null) {
      // Saved data found — decode and populate the list
      final List<dynamic> decoded = json.decode(jsonString);
      setState(() {
        _transactions.addAll(decoded.map((j) => Transaction.fromJson(j)));
        _isLoading = false;
      });
    } else {
      // First time on home screen — load sample data so the demo looks alive
      setState(() {
        _transactions.addAll(_sampleTransactions());
        _isLoading = false;
      });
      // Persist the sample data right away
      await _saveTransactions();
    }
  }

  // Encode the list to JSON and write to SharedPreferences.
  // Called after every add or delete.
  Future<void> _saveTransactions() async {
    final prefs = await SharedPreferences.getInstance();
    final jsonString =
        json.encode(_transactions.map((t) => t.toJson()).toList());
    await prefs.setString(_storageKey, jsonString);
  }

  // ── Computed totals ────────────────────────────────────────────────────────
  double get totalIncome => _transactions
      .where((t) => t.type == TransactionType.income)
      .fold(0.0, (sum, t) => sum + t.amount);

  double get totalExpense => _transactions
      .where((t) => t.type == TransactionType.expense)
      .fold(0.0, (sum, t) => sum + t.amount);

  double get balance => totalIncome - totalExpense;

  // ── Actions ────────────────────────────────────────────────────────────────
  Future<void> _deleteTransaction(String id) async {
    setState(() => _transactions.removeWhere((t) => t.id == id));
    await _saveTransactions(); // persist after every change
  }

  Future<void> _addTransaction(Transaction tx) async {
    setState(() => _transactions.insert(0, tx)); // newest on top
    await _saveTransactions(); // persist after every change
  }

  void _showAddSheet() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => AddTransactionSheet(onAdd: _addTransaction),
    );
  }

  // ── Build ──────────────────────────────────────────────────────────────────
  @override
  Widget build(BuildContext context) {
    // Show a loading spinner while reading from disk
    if (_isLoading) {
      return const Scaffold(
        body: Center(child: CircularProgressIndicator()),
      );
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('Expense Tracker'),
        centerTitle: true,
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.fromLTRB(16, 12, 16, 100),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // ── Balance summary card ─────────────────────────────────────
            BalanceCard(
              balance: balance,
              totalIncome: totalIncome,
              totalExpense: totalExpense,
            ),
            const SizedBox(height: 24),

            // ── Section header ───────────────────────────────────────────
            Text(
              'Transactions',
              style: Theme.of(context)
                  .textTheme
                  .titleMedium
                  ?.copyWith(fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 12),

            // ── List or empty state ──────────────────────────────────────
            if (_transactions.isEmpty)
              const Center(
                child: Padding(
                  padding: EdgeInsets.all(40),
                  child: Text(
                    'No transactions yet.\nTap + to add one.',
                    textAlign: TextAlign.center,
                  ),
                ),
              )
            else
              ListView.separated(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: _transactions.length,
                separatorBuilder: (context, index) =>
                    const SizedBox(height: 8),
                itemBuilder: (_, index) {
                  final tx = _transactions[index];
                  return TransactionCard(
                    transaction: tx,
                    onDelete: () => _deleteTransaction(tx.id),
                  );
                },
              ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: _showAddSheet,
        icon: const Icon(Icons.add),
        label: const Text('Add'),
      ),
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Sample transactions shown on first launch so the app looks populated
// ─────────────────────────────────────────────────────────────────────────────
List<Transaction> _sampleTransactions() {
  final now = DateTime.now();
  return [
    Transaction(
      id: 'sample_1',
      title: 'Monthly Salary',
      amount: 3000,
      category: 'Salary',
      date: DateTime(now.year, now.month, 1),
      type: TransactionType.income,
    ),
    Transaction(
      id: 'sample_2',
      title: 'Grocery Shopping',
      amount: 120,
      category: 'Food',
      date: DateTime(now.year, now.month, 2),
      type: TransactionType.expense,
    ),
    Transaction(
      id: 'sample_3',
      title: 'Monthly Bus Pass',
      amount: 45,
      category: 'Transport',
      date: DateTime(now.year, now.month, 2),
      type: TransactionType.expense,
    ),
    Transaction(
      id: 'sample_4',
      title: 'Freelance Project',
      amount: 500,
      category: 'Salary',
      date: DateTime(now.year, now.month, 3),
      type: TransactionType.income,
    ),
    Transaction(
      id: 'sample_5',
      title: 'Netflix Subscription',
      amount: 15,
      category: 'Entertainment',
      date: DateTime(now.year, now.month, 3),
      type: TransactionType.expense,
    ),
  ];
}

// ─────────────────────────────────────────────────────────────────────────────
// BALANCE CARD
// ─────────────────────────────────────────────────────────────────────────────
class BalanceCard extends StatelessWidget {
  final double balance;
  final double totalIncome;
  final double totalExpense;

  const BalanceCard({
    super.key,
    required this.balance,
    required this.totalIncome,
    required this.totalExpense,
  });

  @override
  Widget build(BuildContext context) {
    final cs = Theme.of(context).colorScheme;

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(vertical: 28, horizontal: 24),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [cs.primary, cs.tertiary],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(24),
      ),
      child: Column(
        children: [
          Text(
            'Current Balance',
            style: TextStyle(
              color: cs.onPrimary.withValues(alpha: 0.8),
              fontSize: 14,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            '\$${balance.toStringAsFixed(2)}',
            style: TextStyle(
              color: cs.onPrimary,
              fontSize: 40,
              fontWeight: FontWeight.bold,
              letterSpacing: 1,
            ),
          ),
          const SizedBox(height: 24),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              _SummaryTile(
                label: 'Income',
                amount: totalIncome,
                isIncome: true,
              ),
              Container(
                width: 1,
                height: 44,
                color: cs.onPrimary.withValues(alpha: 0.25),
              ),
              _SummaryTile(
                label: 'Expenses',
                amount: totalExpense,
                isIncome: false,
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _SummaryTile extends StatelessWidget {
  final String label;
  final double amount;
  final bool isIncome;

  const _SummaryTile({
    required this.label,
    required this.amount,
    required this.isIncome,
  });

  @override
  Widget build(BuildContext context) {
    final cs = Theme.of(context).colorScheme;
    final iconColor =
        isIncome ? Colors.greenAccent : Colors.redAccent.shade100;

    return Column(
      children: [
        Row(
          children: [
            Icon(
              isIncome
                  ? Icons.arrow_downward_rounded
                  : Icons.arrow_upward_rounded,
              color: iconColor,
              size: 16,
            ),
            const SizedBox(width: 4),
            Text(
              label,
              style: TextStyle(
                color: cs.onPrimary.withValues(alpha: 0.8),
                fontSize: 13,
              ),
            ),
          ],
        ),
        const SizedBox(height: 4),
        Text(
          '\$${amount.toStringAsFixed(2)}',
          style: TextStyle(
            color: cs.onPrimary,
            fontSize: 20,
            fontWeight: FontWeight.bold,
          ),
        ),
      ],
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// TRANSACTION CARD
// ─────────────────────────────────────────────────────────────────────────────
class TransactionCard extends StatelessWidget {
  final Transaction transaction;
  final VoidCallback onDelete;

  const TransactionCard({
    super.key,
    required this.transaction,
    required this.onDelete,
  });

  IconData _iconForCategory(String category) {
    switch (category) {
      case 'Food':
        return Icons.restaurant_rounded;
      case 'Transport':
        return Icons.directions_bus_rounded;
      case 'Entertainment':
        return Icons.movie_rounded;
      case 'Shopping':
        return Icons.shopping_bag_rounded;
      case 'Health':
        return Icons.local_hospital_rounded;
      case 'Salary':
        return Icons.work_rounded;
      default:
        return Icons.attach_money_rounded;
    }
  }

  @override
  Widget build(BuildContext context) {
    final isExpense = transaction.type == TransactionType.expense;
    final cs = Theme.of(context).colorScheme;
    final amountColor =
        isExpense ? Colors.red.shade400 : Colors.green.shade600;
    final amountLabel =
        '${isExpense ? '-' : '+'}\$${transaction.amount.toStringAsFixed(2)}';

    return Card(
      elevation: 0,
      color: cs.surfaceContainerHighest.withValues(alpha: 0.45),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
      child: ListTile(
        contentPadding:
            const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
        leading: CircleAvatar(
          backgroundColor: amountColor.withValues(alpha: 0.12),
          child: Icon(
            _iconForCategory(transaction.category),
            color: amountColor,
            size: 20,
          ),
        ),
        title: Text(
          transaction.title,
          style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 15),
        ),
        subtitle: Text(
          '${transaction.category}  •  '
          '${transaction.date.day}/${transaction.date.month}/${transaction.date.year}',
          style: TextStyle(
            fontSize: 12,
            color: cs.onSurface.withValues(alpha: 0.55),
          ),
        ),
        trailing: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              amountLabel,
              style: TextStyle(
                color: amountColor,
                fontWeight: FontWeight.bold,
                fontSize: 15,
              ),
            ),
            const SizedBox(width: 4),
            IconButton(
              icon: Icon(
                Icons.delete_outline_rounded,
                size: 20,
                color: cs.error.withValues(alpha: 0.7),
              ),
              onPressed: onDelete,
              tooltip: 'Delete',
            ),
          ],
        ),
      ),
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// ADD TRANSACTION SHEET
// ─────────────────────────────────────────────────────────────────────────────
class AddTransactionSheet extends StatefulWidget {
  final Function(Transaction) onAdd;

  const AddTransactionSheet({super.key, required this.onAdd});

  @override
  State<AddTransactionSheet> createState() => _AddTransactionSheetState();
}

class _AddTransactionSheetState extends State<AddTransactionSheet> {
  final _formKey = GlobalKey<FormState>();
  final _titleController = TextEditingController();
  final _amountController = TextEditingController();

  String _category = 'Food';
  TransactionType _type = TransactionType.expense;
  DateTime _date = DateTime.now();

  static const _categories = [
    'Food',
    'Transport',
    'Entertainment',
    'Shopping',
    'Health',
    'Salary',
    'Other',
  ];

  @override
  void dispose() {
    _titleController.dispose();
    _amountController.dispose();
    super.dispose();
  }

  Future<void> _pickDate() async {
    final picked = await showDatePicker(
      context: context,
      initialDate: _date,
      firstDate: DateTime(2020),
      lastDate: DateTime.now(),
    );
    if (picked != null) setState(() => _date = picked);
  }

  void _submit() {
    if (!_formKey.currentState!.validate()) return;

    widget.onAdd(Transaction(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      title: _titleController.text.trim(),
      amount: double.parse(_amountController.text.trim()),
      category: _category,
      date: _date,
      type: _type,
    ));

    Navigator.pop(context);
  }

  @override
  Widget build(BuildContext context) {
    final cs = Theme.of(context).colorScheme;

    return Container(
      decoration: BoxDecoration(
        color: cs.surface,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(28)),
      ),
      padding: EdgeInsets.fromLTRB(
          24, 16, 24, MediaQuery.of(context).viewInsets.bottom + 24),
      child: Form(
        key: _formKey,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Drag handle
            Center(
              child: Container(
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                  color: cs.onSurface.withValues(alpha: 0.2),
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
            ),
            const SizedBox(height: 16),

            Text(
              'New Transaction',
              style: Theme.of(context)
                  .textTheme
                  .titleLarge
                  ?.copyWith(fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 20),

            // Income / Expense toggle
            Row(
              children: [
                Expanded(
                  child: _TypeToggleButton(
                    label: 'Expense',
                    icon: Icons.arrow_upward_rounded,
                    selected: _type == TransactionType.expense,
                    isIncome: false,
                    onTap: () =>
                        setState(() => _type = TransactionType.expense),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _TypeToggleButton(
                    label: 'Income',
                    icon: Icons.arrow_downward_rounded,
                    selected: _type == TransactionType.income,
                    isIncome: true,
                    onTap: () =>
                        setState(() => _type = TransactionType.income),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),

            TextFormField(
              controller: _titleController,
              textCapitalization: TextCapitalization.sentences,
              decoration: const InputDecoration(
                labelText: 'Title',
                prefixIcon: Icon(Icons.title_rounded),
                border: OutlineInputBorder(),
              ),
              validator: (v) =>
                  (v == null || v.trim().isEmpty) ? 'Enter a title' : null,
            ),
            const SizedBox(height: 12),

            TextFormField(
              controller: _amountController,
              keyboardType:
                  const TextInputType.numberWithOptions(decimal: true),
              decoration: const InputDecoration(
                labelText: 'Amount',
                prefixIcon: Icon(Icons.attach_money_rounded),
                border: OutlineInputBorder(),
              ),
              validator: (v) {
                if (v == null || v.isEmpty) return 'Enter an amount';
                final n = double.tryParse(v);
                if (n == null || n <= 0) return 'Enter a valid positive number';
                return null;
              },
            ),
            const SizedBox(height: 12),

            DropdownButtonFormField<String>(
              initialValue: _category,
              decoration: const InputDecoration(
                labelText: 'Category',
                prefixIcon: Icon(Icons.category_rounded),
                border: OutlineInputBorder(),
              ),
              items: _categories
                  .map((c) => DropdownMenuItem(value: c, child: Text(c)))
                  .toList(),
              onChanged: (v) => setState(() => _category = v!),
            ),
            const SizedBox(height: 12),

            InkWell(
              onTap: _pickDate,
              borderRadius: BorderRadius.circular(4),
              child: InputDecorator(
                decoration: const InputDecoration(
                  labelText: 'Date',
                  prefixIcon: Icon(Icons.calendar_today_rounded),
                  border: OutlineInputBorder(),
                ),
                child: Text(
                  '${_date.day}/${_date.month}/${_date.year}',
                  style: const TextStyle(fontSize: 16),
                ),
              ),
            ),
            const SizedBox(height: 24),

            SizedBox(
              width: double.infinity,
              child: FilledButton(
                onPressed: _submit,
                style: FilledButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                child: const Text(
                  'Add Transaction',
                  style: TextStyle(fontSize: 16),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// TYPE TOGGLE BUTTON
// ─────────────────────────────────────────────────────────────────────────────
class _TypeToggleButton extends StatelessWidget {
  final String label;
  final IconData icon;
  final bool selected;
  final bool isIncome;
  final VoidCallback onTap;

  const _TypeToggleButton({
    required this.label,
    required this.icon,
    required this.selected,
    required this.isIncome,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final activeColor =
        isIncome ? Colors.green.shade600 : Colors.red.shade400;

    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 180),
        padding: const EdgeInsets.symmetric(vertical: 12),
        decoration: BoxDecoration(
          color: selected
              ? activeColor.withValues(alpha: 0.12)
              : Colors.transparent,
          border: Border.all(
            color: selected ? activeColor : Colors.grey.shade400,
            width: selected ? 2 : 1,
          ),
          borderRadius: BorderRadius.circular(12),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon,
                color: selected ? activeColor : Colors.grey, size: 18),
            const SizedBox(width: 6),
            Text(
              label,
              style: TextStyle(
                color: selected ? activeColor : Colors.grey,
                fontWeight:
                    selected ? FontWeight.bold : FontWeight.normal,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
