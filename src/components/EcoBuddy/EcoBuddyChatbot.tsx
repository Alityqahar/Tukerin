import { useRef, useState, useEffect } from "react";
import styles from "../ProductCategory/ProductCategory.module.css";

interface EcoBuddyChatbotProps {
	onClose: () => void;
}

type Message = { from: "bot" | "user"; text: string };

const initialMsgs: Message[] = [
	{ from: "bot", text: "Halo! 👋 Saya EcoBuddy, asisten AI untuk ekonomi sirkular di sekolah. Ada yang bisa saya bantu hari ini?" }
];

export default function EcoBuddyChatbot({ onClose }: EcoBuddyChatbotProps) {
	const [messages, setMessages] = useState<Message[]>(initialMsgs);
	const [input, setInput] = useState("");
	const [thinking, setThinking] = useState(false); // Thinking state
	const [typing, setTyping] = useState(false); // Typing animation state
	const [displayedBotMsg, setDisplayedBotMsg] = useState<string | null>(null); // For typing effect
	const bodyRef = useRef<HTMLDivElement>(null);
	const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
	const [thinkingDotCount, setThinkingDotCount] = useState(1); // For animated dots

	// Animated dots for "thinking" indicator
	useEffect(() => {
		if (!thinking) return;
		const interval = setInterval(() => {
			setThinkingDotCount(prev => (prev % 3) + 1);
		}, 400);
		return () => clearInterval(interval);
	}, [thinking]);

	useEffect(() => {
		if (bodyRef.current) {
			bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
		}
	}, [messages, typing, displayedBotMsg, thinking]);

	// Typing effect for bot message
	useEffect(() => {
		if (displayedBotMsg !== null) {
			if (bodyRef.current) {
				bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
			}
		}
	}, [displayedBotMsg]);

	// Clean up typing timeout on unmount
	useEffect(() => {
		return () => {
			if (typingTimeout.current) clearTimeout(typingTimeout.current);
		};
	}, []);

	const showTypingEffect = (fullText: string) => {
		setTyping(true);
		setDisplayedBotMsg("");
		let idx = 0;
		const typeChar = () => {
			setDisplayedBotMsg((prev) => (prev ?? "") + fullText[idx]);
			idx++;
			if (idx < fullText.length) {
				const speed = 18 + Math.random() * 30; // ms per char, random for natural feel
				typingTimeout.current = setTimeout(typeChar, speed);
			} else {
				setTyping(false);
				setDisplayedBotMsg(null);
				setMessages(msgs => [
					...msgs.slice(0, -1),
					{ from: "bot", text: fullText }
				]);
			}
		};
		typeChar();
	};

	const sendMsg = async () => {
		if (!input.trim() || thinking || typing) return;
		const userMsg = { from: "user" as const, text: input };
		setMessages(msgs => [...msgs, userMsg]);
		setInput("");
		setThinking(true);

		// Show thinking indicator for a short, natural delay
		setTimeout(async () => {
			try {
				const res = await fetch("/api/chat", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ message: userMsg.text })
				});
				const data = await res.json();
				const botText = data.response || "Maaf, terjadi kesalahan pada server.";
				setMessages(msgs => [
					...msgs,
					{ from: "bot", text: "" } // Placeholder for typing effect
				]);
				setThinking(false);
				showTypingEffect(botText);
			} catch {
				setMessages(msgs => [
					...msgs,
					{ from: "bot", text: "Maaf, tidak dapat terhubung ke server chatbot." }
				]);
				setThinking(false);
			}
		}, 600 + Math.random() * 400); // 600-1000ms thinking delay
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") sendMsg();
	};

	return (
		<div className={styles.ecoBuddyModalOverlay} tabIndex={-1}>
			<div className={styles.ecoBuddyModal} role="dialog" aria-modal="true">
				<div className={styles.ecoBuddyHeader}>
					<span className={styles.ecoBuddyTitle}>
						<i className="fas fa-robot"></i> EcoBuddy
					</span>
					<button
						className={styles.ecoBuddyCloseBtn}
						onClick={onClose}
						aria-label="Tutup EcoBuddy"
					>
						&times;
					</button>
				</div>
				<div className={styles.ecoBuddyBody} ref={bodyRef}>
					{messages.map((msg, idx) => {
						// Typing effect for the last bot message
						if (
							msg.from === "bot" &&
							idx === messages.length - 1 &&
							typing &&
							displayedBotMsg !== null
						) {
							return (
								<div key={idx} className={styles.ecoBuddyMsgRow}>
									<span className={styles.ecoBuddyAvatar}>
										<i className="fas fa-robot"></i>
									</span>
									<div className={styles.ecoBuddyMsgBot}>
										{displayedBotMsg}
										<span className={styles.ecoBuddyCursor} style={{ opacity: 0.6 }}>|</span>
									</div>
								</div>
							);
						}
						return (
							<div
								key={idx}
								className={
									msg.from === "bot"
										? styles.ecoBuddyMsgRow
										: `${styles.ecoBuddyMsgRow} ${styles.ecoBuddyMsgRowUser}`
								}
							>
								{msg.from === "bot" && (
									<span className={styles.ecoBuddyAvatar}>
										<i className="fas fa-robot"></i>
									</span>
								)}
								<div
									className={
										msg.from === "bot"
											? styles.ecoBuddyMsgBot
											: styles.ecoBuddyMsgUser
									}
								>
									{msg.text}
								</div>
								{msg.from === "user" && (
									<span className={`${styles.ecoBuddyAvatar} ${styles.ecoBuddyAvatarUser}`}>
										<i className="fas fa-user"></i>
									</span>
								)}
							</div>
						);
					})}
					{thinking && (
						<div className={styles.ecoBuddyThinking}>
							<span className={styles.ecoBuddyAvatar}>
								<i className="fas fa-robot"></i>
							</span>
							<span className={styles.ecoBuddyThinkingText}>
								EcoBuddy sedang berpikir
								<span className={styles.ecoBuddyDot} style={{ opacity: thinkingDotCount > 0 ? 1 : 0 }}>.</span>
								<span className={styles.ecoBuddyDot} style={{ opacity: thinkingDotCount > 1 ? 1 : 0 }}>.</span>
								<span className={styles.ecoBuddyDot} style={{ opacity: thinkingDotCount > 2 ? 1 : 0 }}>.</span>
							</span>
						</div>
					)}
				</div>
				<form
					className={styles.ecoBuddyInputBar}
					onSubmit={e => {
						e.preventDefault();
						sendMsg();
					}}
				>
					<input
						className={styles.ecoBuddyInput}
						type="text"
						placeholder="Tulis pertanyaan..."
						value={input}
						onChange={e => setInput(e.target.value)}
						onKeyDown={handleKeyDown}
						autoFocus
						aria-label="Ketik pesan ke EcoBuddy"
						disabled={thinking || typing}
					/>
					<button
						type="submit"
						className={styles.ecoBuddySendBtn}
						disabled={!input.trim() || thinking || typing}
						aria-label="Kirim"
					>
						<i className="fas fa-paper-plane"></i>
					</button>
				</form>
			</div>
		</div>
	);
}
