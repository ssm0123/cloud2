package com.example.demo.repository;

import com.example.demo.model.Post;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicLong;

@Repository
public class MemoryPostRepository implements PostRepository {
    private final List<Post> posts = new ArrayList<>();
    private final AtomicLong counter = new AtomicLong();

    public MemoryPostRepository() {
        // 초기 테스트 데이터
        save(Post.builder()
                .title("첫 번째 게시글")
                .content("인터페이스 기반 DAO로 리팩토링된 게시글입니다.")
                .author("관리자")
                .createdAt(LocalDateTime.now())
                .build());
    }

    @Override
    public List<Post> findAll() {
        return new ArrayList<>(posts);
    }

    @Override
    public Optional<Post> findById(Long id) {
        return posts.stream()
                .filter(post -> post.getId().equals(id))
                .findFirst();
    }

    @Override
    public Post save(Post post) {
        if (post.getId() == null) {
            post.setId(counter.incrementAndGet());
            if (post.getCreatedAt() == null) {
                post.setCreatedAt(LocalDateTime.now());
            }
            posts.add(post);
        } else {
            findById(post.getId()).ifPresent(existingPost -> {
                existingPost.setTitle(post.getTitle());
                existingPost.setContent(post.getContent());
                existingPost.setAuthor(post.getAuthor());
            });
        }
        return post;
    }

    @Override
    public void deleteById(Long id) {
        posts.removeIf(post -> post.getId().equals(id));
    }
}
