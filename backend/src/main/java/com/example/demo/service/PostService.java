package com.example.demo.service;

import com.example.demo.dto.PostRequestDto;
import com.example.demo.dto.PostResponseDto;
import java.util.List;

public interface PostService {
    List<PostResponseDto> getAllPosts();
    PostResponseDto getPostById(Long id);
    PostResponseDto createPost(PostRequestDto requestDto);
    PostResponseDto updatePost(Long id, PostRequestDto requestDto);
    void deletePost(Long id);
}
