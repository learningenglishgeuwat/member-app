import VocabularyTopicDetailPage from '../../../components/VocabularyTopicDetailPage';
import { getVocabularyTopicById } from '../../data/topics';
import { VOCAB_TOPIC_WEATHER_WORDS } from '../../data/words/weather';
import '../../shared/vocabulary.css';

const topic = getVocabularyTopicById('weather');

export default function VocabularyWeatherPage() {
  return <VocabularyTopicDetailPage topic={topic} topicWords={VOCAB_TOPIC_WEATHER_WORDS} />;
}

