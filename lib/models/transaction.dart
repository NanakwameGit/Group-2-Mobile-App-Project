// Represents whether a transaction adds or removes money
enum TransactionType { income, expense }

// A single financial transaction
class Transaction {
  final String id;
  final String title;
  final double amount;
  final String category;
  final DateTime date;
  final TransactionType type;

  Transaction({
    required this.id,
    required this.title,
    required this.amount,
    required this.category,
    required this.date,
    required this.type,
  });

  // ── Serialization ──────────────────────────────────────────────────────────

  // Convert this object to a plain Map so it can be JSON-encoded
  Map<String, dynamic> toJson() => {
        'id': id,
        'title': title,
        'amount': amount,
        'category': category,
        'date': date.toIso8601String(),
        'type': type.name, // stores 'income' or 'expense'
      };

  // Rebuild a Transaction from a decoded JSON map
  factory Transaction.fromJson(Map<String, dynamic> json) => Transaction(
        id: json['id'] as String,
        title: json['title'] as String,
        amount: (json['amount'] as num).toDouble(),
        category: json['category'] as String,
        date: DateTime.parse(json['date'] as String),
        type: TransactionType.values.byName(json['type'] as String),
      );
}
