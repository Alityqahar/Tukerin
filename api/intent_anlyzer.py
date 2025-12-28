"""
Intent Analyzer Tool - Untuk menganalisis dan debug intent classification
Jalankan: python intent_analyzer.py
"""

from chatbot_logic import CircularEconomyBot, Intent
from collections import defaultdict
import json

class IntentAnalyzer:
    """Tool untuk menganalisis performa intent classification"""
    
    def __init__(self):
        self.bot = CircularEconomyBot()
        
    def analyze_single(self, message: str, verbose: bool = True):
        """Analisis detail untuk satu pertanyaan"""
        intent, confidence = self.bot.classifier.classify(message)
        
        if verbose:
            print("\n" + "="*70)
            print(f"📝 INPUT: {message}")
            print("="*70)
            print(f"🎯 Intent     : {intent.value}")
            print(f"📊 Confidence : {confidence:.4f}")
            
            # Confidence level
            if confidence >= 0.7:
                level = "HIGH ✅"
            elif confidence >= 0.3:
                level = "MEDIUM ⚠️"
            else:
                level = "LOW ❌"
            print(f"📈 Level      : {level}")
            
            # Response preview
            if confidence >= self.bot.confidence_threshold:
                response = self.bot.kb.get_response(intent)
                print(f"\n💬 Response Preview:")
                print(f"{response[:200]}...")
            else:
                print(f"\n💬 Response: Fallback akan digunakan")
            print("="*70)
        
        return {
            'message': message,
            'intent': intent.value,
            'confidence': confidence,
            'threshold_passed': confidence >= self.bot.confidence_threshold
        }
    
    def analyze_batch(self, messages: list, show_summary: bool = True):
        """Analisis batch pertanyaan"""
        results = []
        intent_distribution = defaultdict(int)
        confidence_ranges = {'high': 0, 'medium': 0, 'low': 0}
        
        for message in messages:
            result = self.analyze_single(message, verbose=False)
            results.append(result)
            
            intent_distribution[result['intent']] += 1
            
            if result['confidence'] >= 0.7:
                confidence_ranges['high'] += 1
            elif result['confidence'] >= 0.3:
                confidence_ranges['medium'] += 1
            else:
                confidence_ranges['low'] += 1
        
        if show_summary:
            self._print_summary(results, intent_distribution, confidence_ranges)
        
        return results
    
    def _print_summary(self, results, intent_distribution, confidence_ranges):
        """Print summary statistik"""
        print("\n" + "="*70)
        print("📊 ANALYSIS SUMMARY")
        print("="*70)
        
        total = len(results)
        
        print(f"\n📈 Total Messages: {total}")
        print(f"\n🎯 Intent Distribution:")
        for intent, count in sorted(intent_distribution.items(), key=lambda x: x[1], reverse=True):
            percentage = (count / total) * 100
            print(f"  • {intent:30s} : {count:3d} ({percentage:5.1f}%)")
        
        print(f"\n📊 Confidence Distribution:")
        print(f"  • HIGH   (≥0.7) : {confidence_ranges['high']:3d} ({confidence_ranges['high']/total*100:5.1f}%)")
        print(f"  • MEDIUM (≥0.3) : {confidence_ranges['medium']:3d} ({confidence_ranges['medium']/total*100:5.1f}%)")
        print(f"  • LOW    (<0.3) : {confidence_ranges['low']:3d} ({confidence_ranges['low']/total*100:5.1f}%)")
        
        avg_confidence = sum(r['confidence'] for r in results) / total
        print(f"\n📉 Average Confidence: {avg_confidence:.4f}")
        
        passed = sum(1 for r in results if r['threshold_passed'])
        print(f"\n✅ Passed Threshold: {passed}/{total} ({passed/total*100:.1f}%)")
        print("="*70)
    
    def find_low_confidence(self, messages: list, threshold: float = 0.3):
        """Temukan pertanyaan dengan confidence rendah"""
        print("\n" + "="*70)
        print(f"🔍 FINDING LOW CONFIDENCE MESSAGES (< {threshold})")
        print("="*70)
        
        low_confidence = []
        
        for message in messages:
            intent, confidence = self.bot.classifier.classify(message)
            if confidence < threshold:
                low_confidence.append({
                    'message': message,
                    'intent': intent.value,
                    'confidence': confidence
                })
        
        if low_confidence:
            print(f"\n❌ Found {len(low_confidence)} low confidence messages:\n")
            for item in sorted(low_confidence, key=lambda x: x['confidence']):
                print(f"  {item['confidence']:.4f} | {item['intent']:20s} | {item['message']}")
        else:
            print(f"\n✅ No low confidence messages found!")
        
        print("="*70)
        return low_confidence
    
    def compare_intents(self, message: str, top_n: int = 5):
        """Bandingkan skor untuk semua intent"""
        print("\n" + "="*70)
        print(f"📝 COMPARING ALL INTENTS FOR: {message}")
        print("="*70)
        
        message_norm = message.lower().strip()
        scores = []
        
        for intent, config in self.bot.classifier.intent_patterns.items():
            score = 0.0
            
            # Pattern matching
            if self.bot.classifier._match_pattern(message_norm, config['patterns']):
                score += 10.0 * config['weight']
            
            # Keyword matching
            keyword_score = self.bot.classifier._calculate_keyword_score(message_norm, config['keywords'])
            score += keyword_score * config['weight']
            
            scores.append({
                'intent': intent.value,
                'score': score,
                'normalized': min(score / 20.0, 1.0)
            })
        
        # Sort by score
        scores.sort(key=lambda x: x['score'], reverse=True)
        
        print(f"\n🏆 Top {top_n} Intent Candidates:\n")
        for i, item in enumerate(scores[:top_n], 1):
            bar = "█" * int(item['normalized'] * 30)
            print(f"  {i}. {item['intent']:25s} | {item['score']:6.2f} | {bar}")
        
        print("="*70)
        return scores
    
    def export_results(self, results: list, filename: str = "intent_analysis.json"):
        """Export hasil analisis ke JSON"""
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(results, f, indent=2, ensure_ascii=False)
        print(f"\n✅ Results exported to {filename}")


def main():
    """Main function dengan menu interaktif"""
    
    analyzer = IntentAnalyzer()
    
    print("="*70)
    print("  🔍 EcoBuddy Intent Analyzer")
    print("="*70)
    print("\nMenu:")
    print("  1. Analyze Single Message")
    print("  2. Analyze Batch Messages")
    print("  3. Find Low Confidence Messages")
    print("  4. Compare All Intents for a Message")
    print("  5. Run Sample Analysis")
    print("  6. Exit")
    print("="*70)
    
    while True:
        choice = input("\nPilihan (1-6): ").strip()
        
        if choice == "1":
            message = input("Masukkan pertanyaan: ").strip()
            if message:
                analyzer.analyze_single(message)
        
        elif choice == "2":
            print("\nMasukkan pertanyaan (satu per baris, ketik 'done' untuk selesai):")
            messages = []
            while True:
                msg = input("> ").strip()
                if msg.lower() == 'done':
                    break
                if msg:
                    messages.append(msg)
            
            if messages:
                analyzer.analyze_batch(messages)
        
        elif choice == "3":
            print("\nMasukkan pertanyaan (satu per baris, ketik 'done' untuk selesai):")
            messages = []
            while True:
                msg = input("> ").strip()
                if msg.lower() == 'done':
                    break
                if msg:
                    messages.append(msg)
            
            if messages:
                threshold = input("Threshold (default 0.3): ").strip()
                threshold = float(threshold) if threshold else 0.3
                analyzer.find_low_confidence(messages, threshold)
        
        elif choice == "4":
            message = input("Masukkan pertanyaan: ").strip()
            if message:
                top_n = input("Top N (default 5): ").strip()
                top_n = int(top_n) if top_n else 5
                analyzer.compare_intents(message, top_n)
        
        elif choice == "5":
            print("\n🧪 Running sample analysis...")
            sample_messages = [
                "Halo",
                "Apa itu ekonomi sirkular?",
                "Jelaskan prinsip 5R",
                "Contoh penerapan",
                "Manfaatnya apa?",
                "Tips dong",
                "Bahaya plastik",
                "Terima kasih",
                "Siapa kamu?",
                "ekonomi",
                "sustainability itu apa?",
                "gimana caranya?"
            ]
            
            results = analyzer.analyze_batch(sample_messages)
            
            export = input("\nExport to JSON? (y/n): ").strip().lower()
            if export == 'y':
                analyzer.export_results(results)
        
        elif choice == "6":
            print("\n👋 Terima kasih!")
            break
        
        else:
            print("❌ Pilihan tidak valid")


if __name__ == "__main__":
    main()