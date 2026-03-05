import VocabularyTopicDetailPage from '../../../components/VocabularyTopicDetailPage';
import { getVocabularyTopicById } from '../../data/topics';
import { VOCAB_TOPIC_CLOTHES_WORDS } from '../../data/words/clothes';
import '../../shared/vocabulary.css';

const topic = getVocabularyTopicById('clothes');

export default function VocabularyClothesPage() {
  return <VocabularyTopicDetailPage topic={topic} topicWords={VOCAB_TOPIC_CLOTHES_WORDS} />;
}

