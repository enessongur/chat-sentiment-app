import gradio as gr
import requests
import json
from transformers import pipeline
import torch
import os

# Duygu analizi modeli yükle
# Türkçe ve İngilizce destekli model
sentiment_analyzer = pipeline(
    "sentiment-analysis",
    model="cardiffnlp/twitter-xlm-roberta-base-sentiment",
    return_all_scores=True
)

def analyze_sentiment(text):
    """
    Metin duygu analizi yapar
    Args:
        text (str): Analiz edilecek metin
    Returns:
        dict: Duygu analizi sonucu
    """
    if not text or not text.strip():
        return {"sentiment": "neutral", "confidence": 0.0}
    
    try:
        # Model ile analiz yap
        results = sentiment_analyzer(text)
        
        # En yüksek skorlu sonucu al
        best_result = max(results[0], key=lambda x: x['score'])
        
        # Sonuçları normalize et
        label = best_result['label'].lower()
        confidence = best_result['score']
        
        # Label mapping
        if 'positive' in label or 'pos' in label:
            sentiment = "positive"
        elif 'negative' in label or 'neg' in label:
            sentiment = "negative"
        else:
            sentiment = "neutral"
            
        return {
            "sentiment": sentiment,
            "confidence": round(confidence, 3),
            "original_label": best_result['label']
        }
        
    except Exception as e:
        print(f"Analiz hatası: {e}")
        return {"sentiment": "neutral", "confidence": 0.0}

def predict_sentiment(text):
    """
    Gradio interface için predict fonksiyonu
    """
    result = analyze_sentiment(text)
    return result["sentiment"]

# Gradio arayüzü oluştur
def create_interface():
    """
    Gradio web arayüzü oluşturur
    """
    with gr.Blocks(
        title="Chat Sentiment Analysis",
        theme=gr.themes.Soft(),
        css="""
        .gradio-container {
            max-width: 800px !important;
            margin: auto !important;
        }
        """
    ) as interface:
        # Minimal UI
        
        with gr.Row():
            with gr.Column():
                text_input = gr.Textbox(label="Metin", placeholder="Metin girin...", lines=3, max_lines=10)
                
                analyze_btn = gr.Button("Analiz Et", variant="primary", size="lg")
                
            with gr.Column():
                sentiment_output = gr.Textbox(label="Duygu", interactive=False, lines=1)
                
                confidence_output = gr.Textbox(label="Güven", interactive=False, lines=1)
        # No examples or extra text
        
        # Analiz fonksiyonu
        def analyze_text(text):
            if not text.strip():
                return "", "0%"
            
            result = analyze_sentiment(text)
            sentiment = result["sentiment"]
            confidence = result["confidence"]
            
            return sentiment, f"{confidence * 100:.1f}%"
        
        # Event handlers
        analyze_btn.click(
            fn=analyze_text,
            inputs=text_input,
            outputs=[sentiment_output, confidence_output]
        )
        
        text_input.submit(
            fn=analyze_text,
            inputs=text_input,
            outputs=[sentiment_output, confidence_output]
        )
        # No additional instructions
    
    return interface

# Gradio arayüzünü oluştur ve başlat
if __name__ == "__main__":
    interface = create_interface()
    port = int(os.environ.get("PORT", "7860"))
    interface.launch(
        server_name="0.0.0.0",
        server_port=port,
        share=False,
        show_error=True
    )

